import React from 'react';
import { Movement, LoggedSet } from '../types';
import { CheckCircle2, Circle } from 'lucide-react';

interface MovementPickerProps {
  movements: Movement[];
  activeMovementIndex: number;
  onSelectMovement: (index: number) => void;
  loggedSets: LoggedSet[];
}

export const MovementPicker: React.FC<MovementPickerProps> = ({
  movements,
  activeMovementIndex,
  onSelectMovement,
  loggedSets
}) => {
  return (
    <div className="bg-stone-900 rounded-xl p-3 sm:p-4 border border-stone-800">
      <div className="text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2.5 px-1">
        7 Movements (5 Sets Each &bull; Soviet W-Wave)
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {movements.map((movement, idx) => {
          const setsCount = loggedSets.filter(s => s.movementId === movement.id).length;
          const isComplete = setsCount >= 5;
          const isActive = idx === activeMovementIndex;

          return (
            <button
              key={movement.id}
              id={`nav-movement-btn-${idx + 1}`}
              type="button"
              onClick={() => onSelectMovement(idx)}
              className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50 text-stone-100'
                  : isComplete
                  ? 'bg-stone-800/60 border-stone-700 hover:border-stone-600 text-stone-300'
                  : 'bg-stone-950/40 border-stone-800/80 hover:border-stone-700 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-amber-400' : 'text-stone-400'}`}>
                  #{idx + 1}
                </span>
                {isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : setsCount > 0 ? (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1 rounded">
                    {setsCount}/5
                  </span>
                ) : (
                  <Circle className="w-3 h-3 text-stone-600" />
                )}
              </div>

              <div className="text-xs font-semibold leading-snug line-clamp-2">
                {movement.name}
              </div>

              <div className="mt-1.5 text-[10px] text-stone-400 truncate">
                {movement.pattern.split('/')[0]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
