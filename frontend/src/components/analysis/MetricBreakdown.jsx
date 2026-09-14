import Card from '../common/Card';

export default function MetricBreakdown({ results }) {
  const { overallScore, accuracy, stability, consistency } = results;

  const metrics = [
    {
      label: 'Performance Score',
      value: `${overallScore}%`,
      subtitle: 'Overall consistency composite',
      highlight: true,
      color: 'text-primary-700 bg-primary-50 border-primary-200/80',
    },
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      subtitle: 'Heuristic signal envelope match',
      highlight: false,
      color: 'text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 border-slate-200/70 dark:border-slate-600/70',
    },
    {
      label: 'Stability',
      value: `${stability}%`,
      subtitle: 'Energy & amplitude steadiness',
      highlight: false,
      color: 'text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 border-slate-200/70 dark:border-slate-600/70',
    },
    {
      label: 'Consistency',
      value: `${consistency}%`,
      subtitle: 'Phrase dynamic continuity',
      highlight: false,
      color: 'text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-700/50 border-slate-200/70 dark:border-slate-600/70',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <Card
          key={m.label}
          className={`p-4 rounded-xl border flex flex-col justify-between ${m.color}`}
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {m.label}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {m.value}
              </span>
              {m.highlight && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-primary-600 text-white">
                  Composite
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-600/50">
            {m.subtitle}
          </p>
        </Card>
      ))}
    </div>
  );
}
