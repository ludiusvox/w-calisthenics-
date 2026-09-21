import React, { useState } from 'react';
import { LoggedSet, Routine, RoutineType } from '../types';
import { X, Copy, Check, RotateCcw, Award, Dumbbell, Clock } from 'lucide-react';

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine: Routine;
  routineType: RoutineType;
  loggedSets: LoggedSet[];
  sandbagWeight: number;
  weightUnit: 'lbs' | 'kg';
  onResetWorkout: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  isOpen,
  onClose,
  routine,
  routineType,
  loggedSets,
  sandbagWeight,
  weightUnit,
  onResetWorkout
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalSets = loggedSets.length;
  const totalReps = loggedSets.reduce((acc, curr) => acc + curr.repsCompleted, 0);
  const avgRpe = totalSets > 0
    ? (loggedSets.reduce((acc, curr) => acc + curr.rpe, 0) / totalSets).toFixed(1)
    : '0.0';
  const avgRest = totalSets > 0
    ? Math.round(loggedSets.reduce((acc, curr) => acc + curr.restSecondsActual, 0) / totalSets)
    : 0;

  const generateMarkdownReport = () => {
    let report = `# Soviet W-Wave Workout Log\n`;
    report += `Routine: ${routine.title} (${routineType.toUpperCase()})\n`;
    if (routineType === 'sandbag') {
      report += `Sandbag Load: ${sandbagWeight} ${weightUnit} (Constant)\n`;
    }
    report += `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    report += `Total Volume: ${totalSets} sets | ${totalReps} total reps | Avg RPE: ${avgRpe} | Avg Rest: ${avgRest}s\n\n`;
    report += `### Exercise Details\n`;

    routine.movements.forEach((mov) => {
      const sets = loggedSets.filter(s => s.movementId === mov.id);
      if (sets.length > 0) {
        report += `\n**${mov.name}** (${mov.pattern})\n`;
        sets.forEach((s) => {
          report += `- Set ${s.setNumber}: ${s.repsCompleted} reps @ RPE ${s.rpe} | Target: ${s.targetRepRange} | Rest: ${s.restSecondsActual}s${s.notes ? ` (${s.notes})` : ''}\n`;
        });
      }
    });

    return report;
  };

  const handleCopy = async () => {
    try {
      const text = generateMarkdownReport();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Soviet "W" Wave Workout Summary</h2>
              <p className="text-xs text-stone-400">{routine.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-white border border-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Total Sets</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {totalSets} <span className="text-xs font-normal text-stone-400">/ 35</span>
              </div>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Total Reps</div>
              <div className="text-2xl font-black font-mono text-stone-100 mt-1">
                {totalReps}
              </div>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Average RPE</div>
              <div className="text-2xl font-black font-mono text-amber-300 mt-1">
                {avgRpe}
              </div>
            </div>

            <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Avg Rest</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1 flex items-baseline gap-1">
                {avgRest}<span className="text-xs font-normal text-stone-400">s</span>
              </div>
            </div>
          </div>

          {/* Movement Details Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Movement Sets Breakdown
            </h3>

            {routine.movements.map((mov, idx) => {
              const sets = loggedSets.filter(s => s.movementId === mov.id);
              return (
                <div
                  key={mov.id}
                  className="p-3 rounded-lg bg-stone-950/50 border border-stone-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-200">
                      {idx + 1}. {mov.name}
                    </span>
                    <span className="font-mono text-stone-400">
                      {sets.length}/5 sets
                    </span>
                  </div>

                  {sets.length > 0 ? (
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {sets.map((s) => (
                        <div
                          key={s.id}
                          className="bg-stone-900 border border-stone-800 rounded p-1.5 text-center text-[11px] font-mono"
                        >
                          <div className="text-amber-400 font-bold">S{s.setNumber}</div>
                          <div className="text-stone-100 font-semibold">{s.repsCompleted}r</div>
                          <div className="text-stone-400 text-[10px]">RPE {s.rpe}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-400 italic">
                      No sets logged yet for this movement.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            id="reset-workout-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all logged sets for this workout?')) {
                onResetWorkout();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workout</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="copy-summary-markdown-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Workout Log'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
