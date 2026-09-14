import Card from '../common/Card';

export default function MetricCard({
  label,
  value,
  change,
  isPositive,
  status,
  caption,
  icon,
  className = '',
}) {
  return (
    <Card className={`p-5 flex flex-col justify-between hover:border-slate-300 transition-colors ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{label}</p>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</span>
            {change && (
              <span
                className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
                  isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {change}
              </span>
            )}
            {status && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {status}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100/60 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {caption && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{caption}</p>
        </div>
      )}
    </Card>
  );
}
