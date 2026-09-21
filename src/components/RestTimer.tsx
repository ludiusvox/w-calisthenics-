import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Volume2, VolumeX, BellRing, FastForward } from 'lucide-react';
import { sound } from '../utils/audio';

interface RestTimerProps {
  initialSeconds?: number;
  isActive: boolean;
  onTimerEnd?: () => void;
  onElapsedUpdate?: (elapsed: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentExerciseName?: string;
  nextSetNumber?: number;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 75,
  isActive,
  onTimerEnd,
  onElapsedUpdate,
  soundEnabled,
  onToggleSound,
  currentExerciseName,
  nextSetNumber
}) => {
  const [targetDuration, setTargetDuration] = useState<number>(initialSeconds);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(isActive);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  // Keep track of total elapsed rest
  const elapsedRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Sync initialSeconds when active changes
  useEffect(() => {
    if (isActive) {
      setSecondsRemaining(initialSeconds);
      setTargetDuration(initialSeconds);
      setIsRunning(true);
      setHasFinished(false);
      elapsedRef.current = 0;
    } else {
      setIsRunning(false);
    }
  }, [isActive, initialSeconds]);

  // Notify parent of elapsed seconds
  const notifyElapsed = useCallback((elapsed: number) => {
    onElapsedUpdate?.(elapsed);
  }, [onElapsedUpdate]);

  // Main countdown loop
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      elapsedRef.current += 1;
      notifyElapsed(elapsedRef.current);

      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Timer finished
          if (soundEnabled) {
            sound.playRestComplete();
            sound.vibrate([200, 100, 200]);
          }
          setHasFinished(true);
          setIsRunning(false);
          onTimerEnd?.();
          return 0;
        }

        // Sound warning at 3, 2, 1 seconds
        if (soundEnabled && (prev === 4 || prev === 3 || prev === 2)) {
          sound.playCountdownWarning();
          sound.vibrate(80);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, soundEnabled, onTimerEnd, notifyElapsed]);

  const togglePlay = () => {
    if (secondsRemaining === 0) {
      // restart with current targetDuration
      setSecondsRemaining(targetDuration);
      setHasFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = (secs: number = targetDuration) => {
    setIsRunning(false);
    setTargetDuration(secs);
    setSecondsRemaining(secs);
    setHasFinished(false);
    elapsedRef.current = 0;
  };

  const addSeconds = (amount: number) => {
    setSecondsRemaining((prev) => Math.max(0, prev + amount));
    setTargetDuration((prev) => Math.max(15, prev + amount));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const progressPct = targetDuration > 0
    ? Math.max(0, Math.min(100, ((targetDuration - secondsRemaining) / targetDuration) * 100))
    : 100;

  return (
    <div
      id="rest-timer-module"
      className={`rounded-xl border transition-all duration-300 p-4 sm:p-5 ${
        hasFinished
          ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
          : isRunning
          ? 'bg-stone-900 border-amber-500/40 shadow-lg shadow-amber-500/10'
          : 'bg-stone-900/90 border-stone-800'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            {isRunning && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                hasFinished ? 'bg-emerald-400' : isRunning ? 'bg-amber-400' : 'bg-stone-500'
              }`}
            />
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-stone-300">
            Rest Period Tracker (60–90s Soviet Protocol)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="timer-sound-toggle"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700 transition"
            title={soundEnabled ? 'Mute timer beeps' : 'Enable timer beeps'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="flex items-baseline gap-3">
          <div
            id="rest-timer-digits"
            className={`font-mono text-5xl sm:text-6xl font-black tracking-tight ${
              hasFinished
                ? 'text-emerald-400 animate-pulse'
                : isRunning
                ? 'text-amber-400'
                : 'text-stone-300'
            }`}
          >
            {formatTime(secondsRemaining)}
          </div>
          <div className="flex flex-col text-xs text-stone-400">
            <span>Target: {targetDuration}s</span>
            <span className="font-mono text-[11px] text-stone-300">
              Elapsed: {elapsedRef.current}s
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="timer-minus-15"
            onClick={() => addSeconds(-15)}
            className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition active:scale-95"
            title="Subtract 15s"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="timer-play-pause-btn"
            onClick={togglePlay}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition active:scale-95 ${
              hasFinished
                ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md shadow-emerald-500/20'
                : isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-100 hover:bg-white text-stone-900 shadow'
            }`}
          >
            {hasFinished ? (
              <>
                <BellRing className="w-4 h-4" />
                <span>Rest Done! Restart</span>
              </>
            ) : isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Rest</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="timer-plus-15"
            onClick={() => addSeconds(15)}
            className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition active:scale-95"
            title="Add 15s"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="timer-reset-btn"
            onClick={() => resetTimer(targetDuration)}
            className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition active:scale-95"
            title="Reset to target"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isRunning && (
            <button
              type="button"
              id="timer-skip-btn"
              onClick={() => {
                setSecondsRemaining(0);
                setHasFinished(true);
                setIsRunning(false);
                onTimerEnd?.();
              }}
              className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition active:scale-95"
              title="Skip remaining rest"
            >
              <FastForward className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden my-3">
        <div
          className={`h-full transition-all duration-300 ${
            hasFinished ? 'bg-emerald-400' : isRunning ? 'bg-amber-400' : 'bg-stone-500'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Quick Presets (60s, 75s, 90s - from protocol) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-stone-400 mr-1">Presets:</span>
          {[60, 75, 90].map((presetSec) => (
            <button
              key={presetSec}
              type="button"
              id={`preset-btn-${presetSec}`}
              onClick={() => resetTimer(presetSec)}
              className={`px-2.5 py-1 text-xs rounded font-mono transition ${
                targetDuration === presetSec
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {presetSec}s
            </button>
          ))}
        </div>

        {nextSetNumber && currentExerciseName && (
          <div className="text-xs text-stone-400 truncate">
            Up next: <span className="text-stone-200 font-medium">{currentExerciseName}</span> (Set {nextSetNumber}/5)
          </div>
        )}
      </div>
    </div>
  );
};
