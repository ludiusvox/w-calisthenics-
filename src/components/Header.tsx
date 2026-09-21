import React, { useState } from 'react';
import { RoutineType } from '../types';
import { ROUTINES } from '../data/routines';
import { Dumbbell, Activity, BarChart2, Volume2, VolumeX, Info, X } from 'lucide-react';

interface HeaderProps {
  activeRoutine: RoutineType;
  onSelectRoutine: (r: RoutineType) => void;
  sandbagWeight: number;
  weightUnit: 'lbs' | 'kg';
  onUpdateSandbagWeight: (wt: number) => void;
  onToggleWeightUnit: () => void;
  loggedSetsCount: number;
  onOpenSummary: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRoutine,
  onSelectRoutine,
  sandbagWeight,
  weightUnit,
  onUpdateSandbagWeight,
  onToggleWeightUnit,
  loggedSetsCount,
  onOpenSummary,
  soundEnabled,
  onToggleSound
}) => {
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  return (
    <>
      <header className="bg-stone-900/95 backdrop-blur-md border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Logo & Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-md shadow-amber-500/20">
                  <Activity className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-stone-100 flex items-center gap-1.5">
                    <span>Soviet "W" Wave</span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      5-SET
                    </span>
                  </h1>
                  <p className="text-[11px] text-stone-400">
                    Rest Period Tracker & RPE Logger
                  </p>
                </div>
              </div>

              {/* Mobile controls quick row */}
              <div className="flex items-center gap-1 md:hidden">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(true)}
                  className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700"
                  title="Protocol Info"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onToggleSound}
                  className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={onOpenSummary}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-stone-200 text-xs font-mono font-bold border border-stone-700 flex items-center gap-1"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{loggedSetsCount}/35</span>
                </button>
              </div>
            </div>

            {/* Middle: Routine Switcher Tabs */}
            <div className="flex items-center bg-stone-950/80 p-1 rounded-xl border border-stone-800 self-stretch md:self-auto justify-center">
              <button
                type="button"
                id="routine-sandbag-tab"
                onClick={() => onSelectRoutine('sandbag')}
                className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeRoutine === 'sandbag'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Set 1: Sandbag</span>
              </button>

              <button
                type="button"
                id="routine-bodyweight-tab"
                onClick={() => onSelectRoutine('bodyweight')}
                className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeRoutine === 'bodyweight'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Set 2: Bodyweight</span>
              </button>
            </div>

            {/* Desktop right controls: Load config, Info, Sound, Summary */}
            <div className="hidden md:flex items-center gap-2">
              {activeRoutine === 'sandbag' && (
                <div className="flex items-center bg-stone-950/80 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-300 gap-1.5">
                  <span className="text-stone-400">Bag:</span>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={sandbagWeight}
                    onChange={(e) => onUpdateSandbagWeight(Math.max(5, parseInt(e.target.value) || 0))}
                    className="w-12 bg-transparent text-amber-400 font-mono font-bold text-center focus:outline-none focus:ring-1 focus:ring-amber-400 rounded"
                  />
                  <button
                    type="button"
                    onClick={onToggleWeightUnit}
                    className="text-[10px] font-mono text-stone-400 hover:text-amber-300 underline"
                  >
                    {weightUnit}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowInfoModal(true)}
                className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700 transition"
                title="Soviet W-Wave Info"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onToggleSound}
                className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700 transition"
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                id="header-summary-btn"
                onClick={onOpenSummary}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 flex items-center gap-1.5 transition"
              >
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span>Log ({loggedSetsCount}/35)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 text-stone-100 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Info className="w-5 h-5" />
              </span>
              <h2 className="text-base font-bold">Soviet "W" Wave Rep Structure</h2>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              The Soviet "W" wave is designed for fixed-weight or bodyweight movements to drive maximum repetition volume without early central nervous system fatigue. By oscillating between high, low, and moderate reps, neuromuscular recovery occurs mid-exercise.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-stone-950/70 border border-stone-800">
                <div className="font-bold text-amber-400">Set 1: High Reps (12–15 reps)</div>
                <div className="text-stone-300">Build volume; leave 2–3 reps in reserve (~RPE 7-8).</div>
              </div>

              <div className="p-2.5 rounded bg-stone-950/70 border border-stone-800">
                <div className="font-bold text-amber-400">Set 2: Low Reps (5–7 reps)</div>
                <div className="text-stone-300">Neural reset; focus on explosive concentric speed (~RPE 7).</div>
              </div>

              <div className="p-2.5 rounded bg-stone-950/70 border border-stone-800">
                <div className="font-bold text-amber-400">Set 3: Mid Reps (8–10 reps)</div>
                <div className="text-stone-300">Work capacity under moderate metabolic fatigue (~RPE 8).</div>
              </div>

              <div className="p-2.5 rounded bg-stone-950/70 border border-stone-800">
                <div className="font-bold text-amber-400">Set 4: Low Reps (4–6 reps)</div>
                <div className="text-stone-300">Recovery wave; restore velocity and clean form (~RPE 7-7.5).</div>
              </div>

              <div className="p-2.5 rounded bg-stone-950/70 border border-stone-800">
                <div className="font-bold text-amber-400">Set 5: Peak Reps (AMRAP / 12+ reps)</div>
                <div className="text-stone-300">Max capacity drive; pull clean reps to near-failure (~RPE 9-10).</div>
              </div>
            </div>

            <div className="pt-2 text-xs text-stone-400 border-t border-stone-800">
              <strong>Rest Interval:</strong> 60–90 seconds between all sets. Maintain strict form throughout.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
