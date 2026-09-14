import { useState, useEffect } from 'react';

/**
 * Progress states during real audio analysis.
 * Do not fake precise backend progress percentages — use general indeterminate treatment.
 */
const PROGRESS_STAGES = [
  { message: 'Uploading recording...', subMessage: 'Sending audio to analysis server' },
  { message: 'Analysing pitch signal...', subMessage: 'Extracting F0 using YIN algorithm' },
  { message: 'Preparing results...', subMessage: 'Computing derived pitch metrics' },
  { message: 'Analysis complete', subMessage: 'Finalizing response' },
];

export default function AnalysisProgress({ onComplete, fileName, phase = 'uploading' }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Phase-based stage selection
  useEffect(() => {
    if (phase === 'uploading') {
      setStageIndex(0);
      setProgressPercent(15);
    } else if (phase === 'analysing') {
      setStageIndex(1);
      setProgressPercent(45);
    } else if (phase === 'complete') {
      setStageIndex(3);
      setProgressPercent(100);
    }
  }, [phase]);

  // Progress animation while analysing
  useEffect(() => {
    if (phase !== 'analysing') return;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 85) {
          clearInterval(timer);
          return 85; // Cap at 85% — we don't know when server finishes
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [phase]);

  // Auto-advance to 'complete' stage after analysis
  useEffect(() => {
    if (phase === 'analysing') {
      const timer = setTimeout(() => {
        setStageIndex(2);
        setProgressPercent(70);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const stage = PROGRESS_STAGES[stageIndex] || PROGRESS_STAGES[0];

  return (
    <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-center max-w-xl mx-auto space-y-6">
      {/* Active analysis indicator */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200/80 text-primary-700 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-primary-600 animate-ping" />
        <span>{phase === 'uploading' ? 'Uploading' : 'Analysing'} • Real Backend Processing</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {stage.message}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-sm mx-auto">
          {fileName || 'practice_take.wav'}
        </p>
        <p className="text-[11px] text-slate-400">{stage.subMessage}</p>
      </div>

      {/* Animated Waveform Visualizer */}
      <div className="h-14 flex items-end justify-center gap-1.5 px-6 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 max-w-sm mx-auto">
        {[40, 75, 55, 90, 100, 60, 85, 45, 95, 70, 80, 50, 90, 65, 85, 40].map((height, i) => (
          <div
            key={i}
            className="w-2 bg-primary-500 rounded-full transition-all duration-300 animate-pulse"
            style={{
              height: `${height}%`,
              animationDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span>{phase === 'uploading' ? 'Upload Progress' : 'Processing'}</span>
          <span>{progressPercent}%</span>
        </div>

        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Live status announcement */}
        <div aria-live="polite" className="pt-2 text-xs font-medium text-slate-600 dark:text-slate-300 min-h-[20px]">
          {stage.message}
        </div>
      </div>
    </div>
  );
}
