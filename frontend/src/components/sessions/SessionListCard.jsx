import Badge from '../common/Badge';

export default function SessionListCard({ session, onViewDetails, onDelete }) {
  const { title, date, duration, instrument, focus, score, source, consistencyLabel, analysisVersion, medianHz, pitchStability } = session;

  const isDemo = source === 'demo';
  const isF0 = source === 'user' && analysisVersion?.startsWith('f0-');

  return (
    <div className="group p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Session Info */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{title}</h3>
            {instrument && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {instrument}
              </span>
            )}
            <Badge
              variant={isDemo ? 'neutral' : isF0 ? 'success' : 'primary'}
              className="text-[10px] font-semibold uppercase"
            >
              {isDemo ? 'Demo Session' : isF0 ? 'F0 Analysis' : 'Saved Take'}
            </Badge>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Focus:</span> {focus}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>{date}</span>
            <span>•</span>
            <span>
              Duration: <strong className="text-slate-600 font-medium">{duration}</strong>
            </span>
            {isF0 && medianHz && (
              <>
                <span>•</span>
                <span>
                  Pitch: <strong className="text-emerald-600 font-medium">{medianHz.toFixed(1)} Hz</strong>
                </span>
              </>
            )}
            {!isF0 && consistencyLabel && (
              <>
                <span>•</span>
                <span>
                  Consistency:{' '}
                  <strong className="text-slate-600 font-medium">{consistencyLabel}</strong>
                </span>
              </>
            )}
            {isF0 && pitchStability != null && (
              <>
                <span>•</span>
                <span>
                  Stability:{' '}
                  <strong className="text-emerald-600 font-medium">
                    {(pitchStability * 100).toFixed(0)}%
                  </strong>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Score + Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500">
              {isDemo ? 'Demo Score' : isF0 ? 'Stability' : 'Score'}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {isF0 && pitchStability != null
                  ? `${(pitchStability * 100).toFixed(0)}%`
                  : `${score}%`}
              </span>
              {!isDemo && <span className="text-xs text-primary-600 font-medium">★</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails && onViewDetails(session)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors px-2 py-1 rounded-lg hover:bg-primary-50"
              aria-label={`View details for ${title}`}
            >
              Details
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(session.id)}
                className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                aria-label={`Delete session ${title}`}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
