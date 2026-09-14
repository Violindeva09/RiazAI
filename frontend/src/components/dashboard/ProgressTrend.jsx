import Card from '../common/Card';
import Badge from '../common/Badge';

export default function ProgressTrend({ data }) {
  // Compute min/max to normalize SVG coordinate system
  const points = data || [];
  const minScore = 70;
  const maxScore = 100;

  // Map data to SVG coordinates (viewBox 0 0 500 160)
  // X from 30 to 470, Y from 20 (score 100) to 130 (score 70)
  const coords = points.map((p, idx) => {
    const x = points.length > 1 ? 30 + (idx / (points.length - 1)) * 440 : 250;
    const y = 130 - ((p.score - minScore) / (maxScore - minScore)) * 110;
    return { x, y, ...p };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const polygonPoints = `${coords[0]?.x || 30},140 ${polylinePoints} ${coords[coords.length - 1]?.x || 470},140`;

  return (
    <Card className="overflow-hidden">
      <Card.Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Consistency Progress Trend</h2>
            <Badge variant="neutral" className="text-[10px] font-semibold uppercase">
              Demonstration progress data
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Acoustic signal energy and session consistency progression over the last 6 practice runs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100">
            Current Score: 88%
          </span>
        </div>
      </Card.Header>

      <Card.Content className="p-5 space-y-4">
        {/* SVG Chart Container */}
        <div className="relative w-full h-44 sm:h-52 bg-slate-50/60 rounded-xl border border-slate-100 p-2 sm:p-4 flex flex-col justify-between">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 500 160"
            preserveAspectRatio="none"
            aria-label="Practice consistency trend line chart"
          >
            <defs>
              <linearGradient id="dashboardTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="20" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1="20" y1="56" x2="480" y2="56" stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1="20" y1="93" x2="480" y2="93" stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1="20" y1="130" x2="480" y2="130" stroke="#e2e8f0" strokeDasharray="4 4" />

            {/* Gradient fill underneath */}
            <polygon points={polygonPoints} fill="url(#dashboardTrendGrad)" />

            {/* Main Trend Line */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data point dots & score labels */}
            {coords.map((pt, i) => (
              <g key={i} className="cursor-pointer group">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  className="transition-transform group-hover:scale-125"
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

          {/* X Axis Labels */}
          <div className="flex justify-between px-2 pt-1 border-t border-slate-200/80 text-[11px] text-slate-400 font-medium">
            {coords.map((pt, i) => (
              <div key={i} className="text-center">
                <span className="block text-slate-700 dark:text-slate-300 font-semibold">{pt.session}</span>
                <span className="text-[10px] text-slate-400">{pt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend / Caption */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-600" aria-hidden="true" />
            Performance benchmark score based on heuristic audio stability
          </span>
          <span className="font-medium text-slate-500 dark:text-slate-400">Trajectory: Compounding (+12% over 6 sessions)</span>
        </div>
      </Card.Content>
    </Card>
  );
}
