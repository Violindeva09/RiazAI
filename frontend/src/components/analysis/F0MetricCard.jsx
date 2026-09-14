import Card from '../common/Card';

/**
 * Displays a single F0 metric value with label and subtitle.
 *
 * @param {string} label - Metric label
 * @param {string|number} value - Metric value to display
 * @param {string} subtitle - Description of what the metric means
 * @param {boolean} highlight - Whether to use primary highlight styling
 */
export default function F0MetricCard({ label, value, subtitle, highlight = false }) {
  const color = highlight
    ? 'text-primary-700 bg-primary-50 border-primary-200/80'
    : 'text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 border-slate-200/70 dark:border-slate-600/70';

  return (
    <Card className={`p-4 rounded-xl border flex flex-col justify-between ${color}`}>
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {value}
          </span>
          {highlight && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-primary-600 text-white">
              F0
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-600/50">
        {subtitle}
      </p>
    </Card>
  );
}
