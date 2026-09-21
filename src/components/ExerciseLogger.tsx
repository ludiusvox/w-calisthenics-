import React, { useState, useEffect } from 'react';
import { Movement, RoutineType, LoggedSet, WaveTarget } from '../types';
import { SOVIET_W_WAVE } from '../data/routines';
import { WaveVisualizer } from './WaveVisualizer';
import { RpeSelector } from './RpeSelector';
import { ChevronLeft, ChevronRight, CheckCircle2, Dumbbell, Info, Flame, Sparkles } from 'lucide-react';

interface ExerciseLoggerProps {
  routineType: RoutineType;
  movement: Movement;
  movementIndex: number;
  totalMovements: number;
  sandbagWeight: number;
  weightUnit: 'lbs' | 'kg';
  onUpdateSandbagWeight: (wt: number) => void;
  loggedSets: LoggedSet[];
  onLogSet: (setData: Omit<LoggedSet, 'id' | 'timestamp'>) => void;
  onNavigateMovement: (index: number) => void;
  defaultRestSeconds: number;
  lastRestActualSeconds: number;
}

export const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({
  routineType,
  movement,
  movementIndex,
  totalMovements,
  sandbagWeight,
  weightUnit,
  onUpdateSandbagWeight,
  loggedSets,
  onLogSet,
  onNavigateMovement,
  defaultRestSeconds,
  lastRestActualSeconds
}) => {
  // Filter logged sets for this current movement
  const exerciseLoggedSets = loggedSets.filter(s => s.movementId === movement.id);
  const completedSetNumbers = exerciseLoggedSets.map(s => s.setNumber);

  // Next active set is 1..5
  const nextSetNum = Math.min(
    5,
    Math.max(1, (exerciseLoggedSets.length > 0 ? Math.max(...completedSetNumbers) + 1 : 1))
  );

  const [activeSetNumber, setActiveSetNumber] = useState<number>(nextSetNum);
  const currentWaveTarget: WaveTarget = SOVIET_W_WAVE[activeSetNumber - 1] || SOVIET_W_WAVE[0];

  // Default reps based on wave target
  const initialReps = currentWaveTarget.isAmrap
    ? 15
    : Math.round((currentWaveTarget.minReps + currentWaveTarget.maxReps) / 2);

  const [repsInput, setRepsInput] = useState<number>(initialReps);
  const [rpeInput, setRpeInput] = useState<number>(
    activeSetNumber === 5 ? 9.5 : activeSetNumber === 2 || activeSetNumber === 4 ? 7.0 : 8.0
  );
  const [notesInput, setNotesInput] = useState<string>('');

  // When activeSetNumber changes or movement changes, reset defaults
  useEffect(() => {
    setActiveSetNumber(nextSetNum);
  }, [movement.id, nextSetNum]);

  useEffect(() => {
    const wave = SOVIET_W_WAVE[activeSetNumber - 1] || SOVIET_W_WAVE[0];
    const defaultReps = wave.isAmrap ? 15 : Math.round((wave.minReps + wave.maxReps) / 2);
    setRepsInput(defaultReps);

    // Context-sensitive default RPE based on wave structure
    if (activeSetNumber === 1) setRpeInput(7.5);
    else if (activeSetNumber === 2) setRpeInput(7.0); // neural reset / high speed
    else if (activeSetNumber === 3) setRpeInput(8.0); // work capacity
    else if (activeSetNumber === 4) setRpeInput(7.0); // recovery wave
    else if (activeSetNumber === 5) setRpeInput(9.5); // peak AMRAP
  }, [activeSetNumber]);

  const handleLogSet = () => {
    const weightString = routineType === 'sandbag'
      ? `${sandbagWeight} ${weightUnit}`
      : 'Bodyweight';

    onLogSet({
      routineId: routineType,
      movementId: movement.id,
      movementName: movement.name,
      setNumber: activeSetNumber,
      targetRepRange: currentWaveTarget.repRange,
      repsCompleted: Number(repsInput),
      weightUsed: weightString,
      rpe: Number(rpeInput),
      restSecondsTarget: defaultRestSeconds,
      restSecondsActual: lastRestActualSeconds > 0 ? lastRestActualSeconds : defaultRestSeconds,
      notes: notesInput.trim() || undefined
    });

    setNotesInput('');
    if (activeSetNumber < 5) {
      setActiveSetNumber(activeSetNumber + 1);
    }
  };

  const isCurrentSetLogged = completedSetNumbers.includes(activeSetNumber);

  return (
    <div className="space-y-4">
      {/* Exercise Navigation & Header */}
      <div className="bg-stone-900 rounded-xl p-4 sm:p-5 border border-stone-800 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            type="button"
            id="prev-movement-btn"
            disabled={movementIndex === 0}
            onClick={() => onNavigateMovement(movementIndex - 1)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-stone-300 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev Movement</span>
          </button>

          <div className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Movement {movementIndex + 1} of {totalMovements}
          </div>

          <button
            type="button"
            id="next-movement-btn"
            disabled={movementIndex === totalMovements - 1}
            onClick={() => onNavigateMovement(movementIndex + 1)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-stone-300 transition"
          >
            <span className="hidden sm:inline">Next Movement</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title and movement pattern info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-stone-100 tracking-tight">
              {movement.name}
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-800 text-stone-300 border border-stone-700">
              {movement.pattern}
            </span>
          </div>

          {movement.replacesMovement && (
            <div className="text-xs text-amber-400/90 flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct pattern replacement for: <strong>{movement.replacesMovement}</strong></span>
            </div>
          )}

          {/* Form Cue Callout */}
          <div className="mt-2.5 p-3 rounded-lg bg-stone-950/70 border border-stone-800/80 text-xs sm:text-sm text-stone-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p><strong className="text-stone-200">Execution Cue:</strong> {movement.cues}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-stone-400 text-xs pt-1">
                <span>Equipment: <span className="text-stone-300">{movement.equipment}</span></span>
                {movement.notes && <span className="text-amber-300/80">{movement.notes}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Soviet "W" Wave Visualizer */}
      <WaveVisualizer
        currentSetIndex={activeSetNumber}
        completedSets={completedSetNumbers}
        onSelectSet={(setNum) => setActiveSetNumber(setNum)}
      />

      {/* Set Logging Form */}
      <div className="bg-stone-900 rounded-xl p-4 sm:p-5 border border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-sm">
              S{activeSetNumber}
            </span>
            <div>
              <div className="text-sm font-bold text-stone-100">
                Log Set {activeSetNumber} of 5
              </div>
              <div className="text-xs text-stone-400">
                Target: <span className="text-amber-400 font-semibold">{currentWaveTarget.repRange}</span> &bull; {currentWaveTarget.label}
              </div>
            </div>
          </div>

          {isCurrentSetLogged && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" /> Logged
            </span>
          )}
        </div>

        {/* Inputs row: Reps and Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reps Stepper */}
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span className="font-semibold uppercase tracking-wider">Reps Performed</span>
              <span className="text-amber-400 font-mono">Wave: {currentWaveTarget.repRange}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setRepsInput(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-lg transition active:scale-95"
              >
                -
              </button>
              <input
                id="reps-input"
                type="number"
                min="1"
                max="100"
                value={repsInput}
                onChange={(e) => setRepsInput(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 h-10 bg-stone-900 border border-stone-700 rounded-lg text-center font-mono text-xl font-bold text-stone-100 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setRepsInput(prev => prev + 1)}
                className="w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-lg transition active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Weight Indicator */}
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-300">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-stone-400" />
                <span>{routineType === 'sandbag' ? 'Fixed Sandbag Load' : 'Load Resistance'}</span>
              </span>
              <span className="text-stone-400 text-[11px]">Set weights</span>
            </div>

            {routineType === 'sandbag' ? (
              <div className="flex items-center space-x-2">
                <input
                  id="sandbag-weight-input"
                  type="number"
                  min="5"
                  max="300"
                  value={sandbagWeight}
                  onChange={(e) => onUpdateSandbagWeight(Math.max(5, parseInt(e.target.value) || 0))}
                  className="w-24 h-10 bg-stone-900 border border-stone-700 rounded-lg text-center font-mono text-lg font-bold text-stone-100 focus:outline-none focus:border-amber-400"
                />
                <div className="text-sm font-semibold text-stone-300 font-mono">
                  {weightUnit}
                </div>
                <div className="text-[11px] text-stone-400 ml-auto leading-tight text-right">
                  Constant load for all sets
                </div>
              </div>
            ) : (
              <div className="h-10 flex items-center px-3 bg-stone-900/90 border border-stone-700 rounded-lg text-stone-200 font-medium text-sm justify-between">
                <span>Bodyweight Resistance</span>
                <span className="text-xs text-stone-400">Leverage mechanics</span>
              </div>
            )}
          </div>
        </div>

        {/* RPE Selector */}
        <RpeSelector
          value={rpeInput}
          onChange={(newRpe) => setRpeInput(newRpe)}
          recommendedRpe={currentWaveTarget.rirGuidance}
        />

        {/* Optional Quick Tags / Notes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Set Notes / Velocity Tags (Optional)</span>
            <div className="flex gap-1">
              {['Explosive speed', 'Clean lockout', 'Grip taxed', 'Near failure'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setNotesInput(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700/60"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>
          <input
            id="set-notes-input"
            type="text"
            placeholder="e.g. Explosive concentric, felt 2 reps in reserve..."
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            className="w-full h-9 bg-stone-950/60 border border-stone-800 rounded-lg px-3 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            id="log-set-and-rest-btn"
            type="button"
            onClick={handleLogSet}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition duration-150"
          >
            <Flame className="w-5 h-5 fill-current" />
            <span>
              Log Set {activeSetNumber} & Start {defaultRestSeconds}s Rest Timer
            </span>
          </button>
        </div>
      </div>

      {/* Movement Logged Sets History Table */}
      {exerciseLoggedSets.length > 0 && (
        <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Completed Sets for {movement.name}
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              {exerciseLoggedSets.length} / 5 Sets Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 border-b border-stone-800 font-mono">
                  <th className="py-2 px-2">Set</th>
                  <th className="py-2 px-2">Target</th>
                  <th className="py-2 px-2">Reps</th>
                  <th className="py-2 px-2">Load</th>
                  <th className="py-2 px-2">RPE</th>
                  <th className="py-2 px-2">Rest Taken</th>
                  <th className="py-2 px-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono">
                {exerciseLoggedSets.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-800/30">
                    <td className="py-2 px-2 font-bold text-amber-400">Set {s.setNumber}</td>
                    <td className="py-2 px-2 text-stone-400">{s.targetRepRange}</td>
                    <td className="py-2 px-2 font-bold text-stone-100">{s.repsCompleted}</td>
                    <td className="py-2 px-2 text-stone-300">{s.weightUsed}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        s.rpe <= 7 ? 'text-emerald-400 bg-emerald-500/10' :
                        s.rpe <= 8.5 ? 'text-amber-400 bg-amber-500/10' :
                        'text-rose-400 bg-rose-500/10'
                      }`}>
                        {s.rpe.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-stone-400">{s.restSecondsActual}s</td>
                    <td className="py-2 px-2 text-stone-400 font-sans text-[11px] truncate max-w-[140px]">
                      {s.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
