import { useEffect, useRef } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function SessionDetailModal({ session, onClose, onDelete }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  // Focus management and Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus the panel on open
    if (panelRef.current) panelRef.current.focus();
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!session) return null;

  const isDemo = session.source === 'demo';
  const isF0Session = session.source === 'user' && session.analysisVersion?.startsWith('f0-');

  const {
    title,
    date,
    duration,
    instrument,
    score,
    accuracy,
    stability,
    consistency,
    focus,
    feedback,
    nextStep,
    consistencyLabel,
    // F0 fields
    medianHz,
    rangeHz,
    pitchStability,
    voicingRatio,
    frameCount,
    sampleRate,
    processingTimeMs,
    analysisVersion,
    pitchAvailable,
  } = session;

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Build metric items based on session type
  const metricItems = isF0Session && pitchAvailable
    ? [
        { label: 'Median Pitch', value: medianHz ? `${medianHz.toFixed(1)} Hz` : '—', highlight: true },
        { label: 'Pitch Range', value: rangeHz != null ? `${rangeHz.toFixed(1)} Hz` : '—', subtitle: 'F0 range (max − min)' },
        { label: 'Pitch Stability', value: pitchStability != null ? `${(pitchStability * 100).toFixed(0)}%` : '—', subtitle: 'F0 coefficient of variation' },
        { label: 'Voicing Ratio', value: voicingRatio != null ? `${(voicingRatio * 100).toFixed(0)}%` : '—', subtitle: 'Frames with detectable pitch' },
      ]
    : [
        { label: 'Overall Score', value: `${score || 0}%`, highlight: true },
        { label: 'Accuracy', value: `${accuracy || 0}%`, subtitle: isDemo ? 'Prototype metric' : 'Heuristic metric' },
        { label: 'Stability', value: `${stability || 0}%`, subtitle: isDemo ? 'Prototype metric' : 'Heuristic metric' },
        { label: 'Consistency', value: `${consistency || 0}%`, subtitle: isDemo ? 'Prototype metric' : 'Heuristic metric' },
      ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Session Details"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{title}</h2>
              <Badge
                variant={isDemo ? 'neutral' : 'success'}
                className="text-[10px] font-semibold uppercase"
              >
                {isDemo ? 'Demo Session' : isF0Session ? 'F0 Analysis' : 'Saved Take'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {date} • {duration} • {instrument}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close session details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Session Type Notice */}
        {isDemo && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span><strong>Demonstration session</strong> — prototype metrics for illustrative purposes</span>
          </div>
        )}

        {isF0Session && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span><strong>F0 pitch analysis</strong> — real YIN algorithm results ({analysisVersion || 'f0-yin-1.0'})</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="px-6 py-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {isF0Session && pitchAvailable ? 'F0 Pitch Metrics' : 'Performance Metrics'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metricItems.map((m) => (
              <Card
                key={m.label}
                className={`p-3 text-center ${m.highlight ? 'bg-primary-50/60 border-primary-200/80' : ''}`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                  {m.label}
                </span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5">{m.value}</span>
                {m.subtitle && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">{m.subtitle}</span>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Audio Metadata for F0 sessions */}
        {isF0Session && (sampleRate || processingTimeMs) && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-500">
              {sampleRate && <span>Sample rate: <strong className="text-slate-700">{sampleRate} Hz</strong></span>}
              {frameCount && <span>Frames: <strong className="text-slate-700">{frameCount}</strong></span>}
              {processingTimeMs && <span>Processing: <strong className="text-slate-700">{processingTimeMs.toFixed(0)}ms</strong></span>}
            </div>
          </div>
        )}

        {/* Focus & Feedback */}
        <div className="px-6 pb-5 space-y-4">
          {focus && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Practice Focus
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{focus}</p>
            </div>
          )}

          {feedback && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                {isF0Session ? 'Analysis Notes' : 'Prototype Feedback Summary'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feedback}</p>
            </div>
          )}

          {nextStep && (
            <Card className="bg-primary-50/50 border-primary-100 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary-900 mb-1">
                Suggested Next Step
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{nextStep}</p>
            </Card>
          )}

          {consistencyLabel && (
            <div className="text-xs text-slate-400">
              Session consistency: <strong className="text-slate-600">{consistencyLabel}</strong>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          <div>
            {onDelete && (
              <button
                onClick={() => { onDelete(session.id); onClose(); }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                aria-label={`Delete session ${title}`}
              >
                Delete Session
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
