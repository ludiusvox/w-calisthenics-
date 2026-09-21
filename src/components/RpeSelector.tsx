import React from 'react';
import { RPE_SCALE } from '../data/routines';

interface RpeSelectorProps {
  value: number;
  onChange: (val: number) => void;
  recommendedRpe?: string;
}

export const RpeSelector: React.FC<RpeSelectorProps> = ({
  value,
  onChange,
  recommendedRpe
}) => {
  const currentRpeData = RPE_SCALE.find(item => item.value === value) || RPE_SCALE[2];

  const getRpeColor = (rpe: number) => {
    if (rpe <= 7.0) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (rpe <= 8.5) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getButtonState = (rpe: number) => {
    const isSelected = value === rpe;
    if (isSelected) {
      if (rpe <= 7.0) return 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/30 scale-105';
      if (rpe <= 8.5) return 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30 scale-105';
      return 'bg-rose-500 text-stone-950 font-bold shadow-md shadow-rose-500/30 scale-105';
    }
    return 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700';
  };

  return (
    <div id="rpe-selector-container" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>RPE (Rate of Perceived Exertion)</span>
          {recommendedRpe && (
            <span className="text-[10px] lowercase text-stone-400 font-normal">
              (target: {recommendedRpe})
            </span>
          )}
        </label>
        <div className={`px-2 py-0.5 rounded text-xs font-mono font-medium border ${getRpeColor(value)}`}>
          RPE {value.toFixed(1)} &bull; {currentRpeData.rir}
        </div>
      </div>

      {/* Grid of RPE values */}
      <div className="grid grid-cols-9 gap-1.5">
        {RPE_SCALE.map((item) => (
          <button
            key={item.value}
            id={`rpe-btn-${item.value.toString().replace('.', '_')}`}
            type="button"
            onClick={() => onChange(item.value)}
            className={`py-2 text-xs rounded-md transition-all flex flex-col items-center justify-center font-mono ${getButtonState(item.value)}`}
            title={`${item.value} - ${item.rir} (${item.desc})`}
          >
            <span className="text-sm font-semibold leading-none">{item.value % 1 === 0 ? item.value.toFixed(0) : item.value}</span>
          </button>
        ))}
      </div>

      {/* Description caption */}
      <div className="text-xs text-stone-400 bg-stone-900/80 px-3 py-1.5 rounded border border-stone-800 flex items-center justify-between">
        <span className="font-medium text-stone-300">{currentRpeData.rir}:</span>
        <span className="text-stone-400 text-right truncate ml-2">{currentRpeData.desc}</span>
      </div>
    </div>
  );
};
