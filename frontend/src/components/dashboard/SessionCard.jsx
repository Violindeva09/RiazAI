import Badge from '../common/Badge';

export default function SessionCard({ session }) {
  const { title, date, duration, instrument, focus, score, consistency, status } = session;

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{title}</h3>
          {instrument && (              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {instrument}
            </span>
          )}
          {status && (
            <Badge variant="success" className="text-[10px] font-semibold uppercase">
              {status}
            </Badge>
          )}
        </div>          <p className="text-xs text-slate-500 dark:text-slate-400">            <span className="font-medium text-slate-700 dark:text-slate-300">Focus:</span> {focus}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>{date}</span>
          <span>•</span>
          <span>Duration: <strong className="text-slate-600 font-medium">{duration}</strong></span>
          <span>•</span>
          <span>Consistency: <strong className="text-slate-600 font-medium">{consistency}</strong></span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        <span className="text-[10px] uppercase font-semibold text-slate-400">Demo Score</span>
        <div className="flex items-center gap-1 mt-0.5">            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{score}%</span>
          <span className="text-xs text-primary-600 font-medium">★</span>
        </div>
      </div>
    </div>
  );
}
