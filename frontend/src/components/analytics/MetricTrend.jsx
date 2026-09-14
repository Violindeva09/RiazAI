import Card from '../common/Card';

/**
 * Performance breakdown comparing average Accuracy, Stability, and Consistency
 * derived from stored sessions. Uses neutral 'prototype metric' labels.
 */
export default function MetricTrend({ breakdown }) {
  const { accuracy, stability, consistency } = breakdown || {};

  const metrics = [
    {
      label: 'Accuracy',
      value: accuracy || 0,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-100',
      subtitle: 'Prototype metric',
    },
    {
      label: 'Stability',
      value: stability || 0,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-100',
      subtitle: 'Prototype metric',
    },
    {
      label: 'Consistency',
      value: consistency || 0,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-100',
      subtitle: 'Prototype metric',
    },
  ];

  if (!accuracy && !stability && !consistency) {
    return (
      <Card className="overflow-hidden">
        <Card.Header className="py-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Performance Breakdown</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Accuracy, Stability, Consistency averages</p>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm font-medium">No performance data yet</p>
            <p className="text-xs mt-1">Complete sessions to see your breakdown.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Card.Header className="py-4">
        <h2 className="text-base font-bold text-slate-900">Performance Breakdown</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Average prototype metrics across saved sessions
        </p>
      </Card.Header>

      <Card.Content className="p-5 space-y-5">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.label}</span>
                <span className="text-[10px] text-slate-400 ml-2">{m.subtitle}</span>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{m.value}%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full ${m.bgColor}`}>
              <div
                className={`h-full rounded-full ${m.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, m.value)}%` }}
                role="progressbar"
                aria-valuenow={m.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${m.label}: ${m.value}%`}
              />
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 italic">
            Values represent averages across all stored sessions — prototype metrics for demonstration purposes.
          </p>
        </div>
      </Card.Content>
    </Card>
  );
}
