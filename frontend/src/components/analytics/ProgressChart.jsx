import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * SVG line chart showing session-by-session performance and consistency trend.
 * Handles 0, 1, 2-3, and many sessions gracefully.
 */
export default function ProgressChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card className="overflow-hidden">
        <Card.Header className="py-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Progress Trend</h2>            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Session-by-session performance trajectory</p>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="text-center py-12 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm font-medium">No trend data yet</p>
            <p className="text-xs mt-1">Complete practice sessions to build your progress trend.</p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (data.length === 1) {
    const point = data[0];
    return (
      <Card className="overflow-hidden">
        <Card.Header className="py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Progress Trend</h2>
            <Badge variant="neutral" className="text-[10px] font-semibold">Baseline</Badge>
          </div>            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Session-by-session performance trajectory</p>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-50 border border-primary-200/60 mb-4">
              <span className="text-2xl font-extrabold text-primary-700">{point.score}%</span>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">First session baseline established</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              More sessions will unlock trend analysis. Keep practising to visualise your trajectory.
            </p>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Multi-point chart (2+ sessions)
  const minScore = Math.max(0, Math.min(...data.map((d) => d.score)) - 10);
  const maxScore = Math.min(100, Math.max(...data.map((d) => d.score)) + 10);
  const range = maxScore - minScore || 1;

  const chartW = 500;
  const chartH = 160;
  const padX = 30;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const scoreCoords = data.map((d, idx) => {
    const x = padX + (data.length > 1 ? (idx / (data.length - 1)) * plotW : plotW / 2);
    const y = padY + plotH - ((d.score - minScore) / range) * plotH;
    return { x, y, ...d };
  });

  const consistencyCoords = data.map((d, idx) => {
    const x = padX + (data.length > 1 ? (idx / (data.length - 1)) * plotW : plotW / 2);
    const val = d.consistency || d.score;
    const y = padY + plotH - ((val - minScore) / range) * plotH;
    return { x, y, value: val };
  });

  // Generate smooth cubic bezier path through all points
  const smoothPath = (coords) => {
    if (coords.length < 2) return '';
    if (coords.length === 2) return `M${coords[0].x},${coords[0].y} L${coords[1].x},${coords[1].y}`;
    let d = `M${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const prev = coords[i - 1] || curr;
      const afterNext = coords[i + 2] || next;
      const tension = 0.3;
      const cp1x = curr.x + (next.x - prev.x) * tension;
      const cp1y = curr.y + (next.y - prev.y) * tension;
      const cp2x = next.x - (afterNext.x - curr.x) * tension;
      const cp2y = next.y - (afterNext.y - curr.y) * tension;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return d;
  };

  const scoreLine = smoothPath(scoreCoords);
  const consistencyLine = smoothPath(consistencyCoords);
  const scoreLinePolyline = scoreCoords.map((c) => `${c.x},${c.y}`).join(' ');
  const areaFill = `${scoreCoords[0].x},${padY + plotH} ${scoreLinePolyline} ${scoreCoords[scoreCoords.length - 1].x},${padY + plotH}`;

  return (
    <Card className="overflow-hidden">
      <Card.Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Progress Trend</h2>
            {data.length <= 3 && (
              <Badge variant="warning" className="text-[10px] font-semibold">Early Data</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Performance score across {data.length} saved session{data.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 rounded bg-primary-600" aria-hidden="true" />
            Score
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 rounded bg-emerald-500" aria-hidden="true" />
            Consistency
          </span>
        </div>
      </Card.Header>

      <Card.Content className="p-5">
        <div className="relative w-full h-44 sm:h-52 bg-slate-50/60 rounded-xl border border-slate-100 p-2 sm:p-4">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${chartW} ${chartH}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`Progress trend chart showing ${data.length} sessions. Latest score: ${data[data.length - 1].score}%`}
          >
            <defs>
              <linearGradient id="progressChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.33, 0.66, 1].map((pct, i) => (
              <line
                key={i}
                x1={padX}
                y1={padY + plotH * (1 - pct)}
                x2={chartW - padX}
                y2={padY + plotH * (1 - pct)}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area fill under score line */}
            <polygon points={areaFill} fill="url(#progressChartGrad)" />

            {/* Consistency line (smooth curve) */}
            <path
              d={consistencyLine}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="5 3"
              opacity="0.6"
            />

            {/* Score line (smooth curve) */}
            <path
              d={scoreLine}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {scoreCoords.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-slate-700 select-none"
                >
                  {pt.score}%
                </text>
              </g>
            ))}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between px-1 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
            {scoreCoords.map((pt, i) => (
              <div key={i} className="text-center flex-1 min-w-0">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium block truncate" title={pt.label}>{pt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {data.length <= 3 && (
          <p className="text-xs text-slate-400 mt-3 text-center italic">
            The trend becomes more meaningful as you accumulate additional practice sessions.
          </p>
        )}
      </Card.Content>
    </Card>
  );
}
