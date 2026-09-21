import React from 'react';
import { SOVIET_W_WAVE } from '../data/routines';
import { Check, Flame, Zap, Shield, RotateCcw, Award } from 'lucide-react';

interface WaveVisualizerProps {
  currentSetIndex: number; // 1-based (1 to 5)
  completedSets: number[]; // e.g. [1, 2]
  onSelectSet?: (setNum: number) => void;
}

export const WaveVisualizer: React.FC<WaveVisualizerProps> = ({
  currentSetIndex,
  completedSets,
  onSelectSet
}) => {
  // Wave height percentages representing the Soviet "W" wave:
  // Set 1 (High: 12-15) -> 80%
  // Set 2 (Low: 5-7) -> 35%
  // Set 3 (Mid: 8-10) -> 60%
  // Set 4 (Low: 4-6) -> 30%
  // Set 5 (Peak AMRAP: 12+) -> 100%
  const waveHeights = [80, 35, 60, 30, 100];

  const getSetIcon = (setNum: number) => {
    switch (setNum) {
      case 1:
        return <Flame className="w-3.5 h-3.5" />;
      case 2:
        return <Zap className="w-3.5 h-3.5" />;
      case 3:
        return <Shield className="w-3.5 h-3.5" />;
      case 4:
        return <RotateCcw className="w-3.5 h-3.5" />;
      case 5:
        return <Award className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div id="soviet-w-wave-visualizer" className="bg-stone-900 text-stone-100 rounded-xl p-4 border border-stone-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
            Soviet "W" Wave
          </span>
          <span className="text-xs text-stone-400">5-Set Wave Distribution</span>
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Set <span className="text-amber-400 font-semibold">{currentSetIndex}</span> of 5
        </div>
      </div>

      {/* SVG Wave Line Overlay + 5 Set Columns */}
      <div className="grid grid-cols-5 gap-2 relative pt-2 pb-1">
        {SOVIET_W_WAVE.map((wave, idx) => {
          const isCurrent = currentSetIndex === wave.setNumber;
          const isDone = completedSets.includes(wave.setNumber);
          const heightPct = waveHeights[idx];

          return (
            <button
              key={wave.setNumber}
              id={`wave-set-btn-${wave.setNumber}`}
              type="button"
              onClick={() => onSelectSet?.(wave.setNumber)}
              className={`group flex flex-col items-center text-left rounded-lg p-2.5 transition-all relative border ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/50'
                  : isDone
                  ? 'bg-stone-800/60 border-stone-700/80 hover:border-stone-600'
                  : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'
              }`}
            >
              {/* Header badge */}
              <div className="w-full flex items-center justify-between text-[11px] mb-1.5 font-medium">
                <span className={`flex items-center gap-1 ${isCurrent ? 'text-amber-400 font-bold' : isDone ? 'text-stone-300' : 'text-stone-400'}`}>
                  {getSetIcon(wave.setNumber)}
                  S{wave.setNumber}
                </span>
                {isDone ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                ) : null}
              </div>

              {/* Wave Pillar height representation */}
              <div className="w-full h-14 flex items-end justify-center my-1 bg-stone-950/40 rounded py-1 px-1">
                <div
                  className={`w-full rounded-sm transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                      : isDone
                      ? 'bg-gradient-to-t from-emerald-800 to-emerald-500'
                      : 'bg-stone-700/70 group-hover:bg-stone-600'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              {/* Rep Target */}
              <div className="w-full text-center mt-1">
                <div className={`text-xs font-bold font-mono tracking-tight ${isCurrent ? 'text-amber-300' : isDone ? 'text-stone-200' : 'text-stone-400'}`}>
                  {wave.setNumber === 5 ? 'AMRAP' : wave.minReps + '-' + wave.maxReps}
                </div>
                <div className="text-[10px] text-stone-300 truncate w-full">
                  {wave.label.replace(' Reps', '')}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Target Focus Description for Current Set */}
      {SOVIET_W_WAVE[currentSetIndex - 1] && (
        <div className="mt-3 pt-2.5 border-t border-stone-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-stone-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
              Set {currentSetIndex} Focus:
            </span>
            <span>{SOVIET_W_WAVE[currentSetIndex - 1].focus}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[11px] self-start sm:self-auto">
            Target RPE: {SOVIET_W_WAVE[currentSetIndex - 1].rirGuidance}
          </div>
        </div>
      )}
    </div>
  );
};
