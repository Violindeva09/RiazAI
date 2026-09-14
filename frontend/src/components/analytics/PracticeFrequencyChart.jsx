import Card from '../common/Card';

/**
 * SVG bar chart showing practice minutes per session in chronological order.
 */
export default function PracticeFrequencyChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="overflow-hidden">
        <Card.Header className="py-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Practice Frequency</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Practice minutes per session</p>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="text-center py-12 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">No practice data yet</p>
            <p className="text-xs mt-1">Complete sessions to see your practice frequency.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 1);
  const barWidth = Math.max(20, Math.min(60, 400 / data.length));
  const chartW = Math.max(400, data.length * (barWidth + 12) + 60);
  const chartH = 160;
  const padX = 30;
  const padY = 20;
  const plotH = chartH - padY * 2;

  return (
    <Card className="overflow-hidden">
      <Card.Header className="py-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Practice Frequency</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Minutes per session across {data.length} practice take{data.length !== 1 ? 's' : ''}
        </p>
      </Card.Header>

      <Card.Content className="p-5">
        <div className="relative w-full h-44 sm:h-52 bg-slate-50/60 rounded-xl border border-slate-100 p-2 sm:p-4 overflow-x-auto">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${chartW} ${chartH}`}
            preserveAspectRatio="xMidYEnd meet"
            role="img"
            aria-label={`Practice frequency chart showing ${data.length} sessions. Total: ${data.reduce((s, d) => s + d.minutes, 0)} minutes`}
          >
            {/* Horizontal grid */}
            {[0.25, 0.5, 0.75, 1].map((pct, i) => (
              <g key={i}>
                <line
                  x1={padX}
                  y1={padY + plotH * (1 - pct)}
                  x2={chartW - padX}
                  y2={padY + plotH * (1 - pct)}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padX - 5}
                  y={padY + plotH * (1 - pct) + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400"
                >
                  {Math.round(maxMinutes * pct)}m
                </text>
              </g>
            ))}

            {/* Bars */}
            {data.map((d, idx) => {
              const barH = (d.minutes / maxMinutes) * plotH;
              const x = padX + idx * (barWidth + 12) + 6;
              const y = padY + plotH - barH;

              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx="4"
                    fill="#6366f1"
                    opacity="0.8"
                    className="hover:opacity-100 transition-opacity"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-700"
                  >
                    {d.minutes}m
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={padY + plotH + 14}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400"
                  >
                    {d.label?.length > 8 ? d.label.slice(0, 8) + '…' : d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card.Content>
    </Card>
  );
}
