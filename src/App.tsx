import { useState, useEffect } from 'react';
import { RoutineType, LoggedSet } from './types';
import { ROUTINES } from './data/routines';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { MovementPicker } from './components/MovementPicker';
import { RestTimer } from './components/RestTimer';
import { ExerciseLogger } from './components/ExerciseLogger';
import { WorkoutSummaryModal } from './components/WorkoutSummaryModal';

const STORAGE_KEY_SETS = 'soviet_w_wave_sets_v1';
const STORAGE_KEY_ROUTINE = 'soviet_w_wave_routine_v1';
const STORAGE_KEY_WEIGHT = 'soviet_w_wave_weight_v1';
const STORAGE_KEY_UNIT = 'soviet_w_wave_unit_v1';
const STORAGE_KEY_REST = 'soviet_w_wave_rest_v1';

export default function App() {
  // Local storage state initialization
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROUTINE);
      return saved === 'bodyweight' ? 'bodyweight' : 'sandbag';
    } catch {
      return 'sandbag';
    }
  });

  const [sandbagWeight, setSandbagWeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEIGHT);
      return saved ? Number(saved) : 50;
    } catch {
      return 50;
    }
  });

  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UNIT);
      return saved === 'kg' ? 'kg' : 'lbs';
    } catch {
      return 'lbs';
    }
  });

  const [defaultRestSeconds, setDefaultRestSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REST);
      return saved ? Number(saved) : 75; // 60-90s prescribed
    } catch {
      return 75;
    }
  });

  const [loggedSets, setLoggedSets] = useState<LoggedSet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [activeMovementIndex, setActiveMovementIndex] = useState<number>(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState<boolean>(false);
  const [lastRestActualSeconds, setLastRestActualSeconds] = useState<number>(defaultRestSeconds);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROUTINE, activeRoutine);
    } catch {
      // Storage error ignored
    }
  }, [activeRoutine]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WEIGHT, sandbagWeight.toString());
    } catch {
      // Storage error ignored
    }
  }, [sandbagWeight]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UNIT, weightUnit);
    } catch {
      // Storage error ignored
    }
  }, [weightUnit]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETS, JSON.stringify(loggedSets));
    } catch {
      // Storage error ignored
    }
  }, [loggedSets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REST, defaultRestSeconds.toString());
    } catch {
      // Storage error ignored
    }
  }, [defaultRestSeconds]);

  // Sync sound engine
  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const currentRoutine = ROUTINES[activeRoutine];
  const currentMovement = currentRoutine.movements[activeMovementIndex] || currentRoutine.movements[0];

  // Filter logged sets for active routine
  const routineLoggedSets = loggedSets.filter(s => s.routineId === activeRoutine);

  const handleLogSet = (setData: Omit<LoggedSet, 'id' | 'timestamp'>) => {
    const newSet: LoggedSet = {
      ...setData,
      id: `set_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now()
    };

    setLoggedSets(prev => [...prev, newSet]);

    // Automatically trigger Rest Timer with feedback
    setIsRestTimerActive(false);
    setTimeout(() => {
      setIsRestTimerActive(true);
      if (soundEnabled) {
        sound.playTick();
      }
    }, 50);
  };

  const handleResetWorkout = () => {
    setLoggedSets(prev => prev.filter(s => s.routineId !== activeRoutine));
    setIsRestTimerActive(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* App Header & Navigation */}
      <Header
        activeRoutine={activeRoutine}
        onSelectRoutine={(r) => {
          setActiveRoutine(r);
          setActiveMovementIndex(0);
        }}
        sandbagWeight={sandbagWeight}
        weightUnit={weightUnit}
        onUpdateSandbagWeight={setSandbagWeight}
        onToggleWeightUnit={() => setWeightUnit(prev => prev === 'lbs' ? 'kg' : 'lbs')}
        loggedSetsCount={routineLoggedSets.length}
        onOpenSummary={() => setIsSummaryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Routine Banner Info */}
        <div className="bg-stone-900/60 rounded-xl p-3.5 sm:p-4 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-stone-200 text-sm">
              {currentRoutine.title} &bull; <span className="text-amber-400 font-normal">{currentRoutine.subtitle}</span>
            </div>
            <div className="text-stone-400 mt-0.5 max-w-2xl">
              {currentRoutine.description}
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-[11px] text-stone-400 bg-stone-950/80 px-3 py-1.5 rounded-lg border border-stone-800">
            <span>Rest Protocol:</span>
            <span className="text-amber-400 font-bold">60–90s</span>
          </div>
        </div>

        {/* Sticky/Docked Rest Timer System */}
        <RestTimer
          initialSeconds={defaultRestSeconds}
          isActive={isRestTimerActive}
          onTimerEnd={() => {
            // Timer concluded
          }}
          onElapsedUpdate={(elapsed) => {
            setLastRestActualSeconds(elapsed);
          }}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
          currentExerciseName={currentMovement.name}
          nextSetNumber={
            Math.min(5, (routineLoggedSets.filter(s => s.movementId === currentMovement.id).length + 1))
          }
        />

        {/* 7 Movements Selector Grid */}
        <MovementPicker
          movements={currentRoutine.movements}
          activeMovementIndex={activeMovementIndex}
          onSelectMovement={(idx) => setActiveMovementIndex(idx)}
          loggedSets={routineLoggedSets}
        />

        {/* Active Exercise Logger with Soviet W-Wave and RPE */}
        <ExerciseLogger
          routineType={activeRoutine}
          movement={currentMovement}
          movementIndex={activeMovementIndex}
          totalMovements={currentRoutine.movements.length}
          sandbagWeight={sandbagWeight}
          weightUnit={weightUnit}
          onUpdateSandbagWeight={setSandbagWeight}
          loggedSets={routineLoggedSets}
          onLogSet={handleLogSet}
          onNavigateMovement={(idx) => setActiveMovementIndex(idx)}
          defaultRestSeconds={defaultRestSeconds}
          lastRestActualSeconds={lastRestActualSeconds}
        />
      </main>

      {/* Workout Summary Modal */}
      <WorkoutSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        routine={currentRoutine}
        routineType={activeRoutine}
        loggedSets={routineLoggedSets}
        sandbagWeight={sandbagWeight}
        weightUnit={weightUnit}
        onResetWorkout={handleResetWorkout}
      />

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-4 px-4 text-center text-xs text-stone-400 font-mono">
        Soviet "W" Wave System &bull; 5 Sets &bull; 60–90s Rest &bull; RPE 6–10 Logging
      </footer>
    </div>
  );
}
