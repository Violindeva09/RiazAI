import { NavLink } from 'react-router-dom';
import Badge from '../common/Badge';

export default function DashboardPreview() {
  return (
    <section id="preview" className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="neutral" className="text-xs font-semibold uppercase tracking-wider">
              Product Interface Preview
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for calm, focused musicians.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A clean, clutter-free workspace that turns practice logs into actionable patterns.
          </p>
        </div>

        {/* Mockup Container */}
        <div className="mt-14 max-w-5xl mx-auto">
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-3 px-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Interactive product preview — Demonstration data
            </span>
            <NavLink
              to="/dashboard"
              className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"
            >
              Open Full Dashboard &rarr;
            </NavLink>
          </div>

          {/* Realistic Dashboard Window Frame */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Window bar */}
            <div className="h-10 bg-slate-100/80 border-b border-slate-200 px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="ml-2 text-xs font-medium text-slate-500">RiazAI Dashboard — riazai.app/dashboard</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Demo Mode</span>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Top Greeting & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Namaste, Musician</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Here is your recent practice consistency overview.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <NavLink
                    to="/analyse"
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-xs"
                  >
                    Start Practice Analysis
                  </NavLink>
                  <NavLink
                    to="/journal"
                    className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Log Journal
                  </NavLink>
                </div>
              </div>

              {/* 4 Key Prototype Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Performance Score</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">88%</span>
                    <span className="text-xs text-emerald-600 font-semibold">+4%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Consistency benchmark</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Session Consistency</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">84%</span>
                    <span className="text-xs text-slate-500 font-medium">Steady</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Energy stability index</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Practice Time</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">6.4h</span>
                    <span className="text-xs text-slate-500 font-medium">This Week</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Goal: 7.0 hrs / week</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Practice Streak</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">5</span>
                    <span className="text-xs text-emerald-600 font-medium">Days</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Personal streak: 12 days</p>
                </div>
              </div>

              {/* Split Row: Progress Trend SVG & Recent Practice Card */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Trend Graph Mockup */}
                <div className="lg:col-span-7 p-5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                        Consistency Trend (Last 6 Sessions)
                      </h4>
                      <p className="text-[11px] text-slate-400">Steady upward trajectory in volume & timing stability</p>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      Avg: 83%
                    </span>
                  </div>

                  {/* SVG Chart */}
                  <div className="my-3 h-32 w-full flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="300" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />

                      {/* Gradient fill */}
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area polygon */}
                      <polygon
                        points="0,85 50,75 100,70 150,55 200,45 250,40 300,30 300,100 0,100"
                        fill="url(#trendGrad)"
                      />

                      {/* Trend line */}
                      <polyline
                        points="0,85 50,75 100,70 150,55 200,45 250,40 300,30"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data dots */}
                      {[[0, 85], [50, 75], [100, 70], [150, 55], [200, 45], [250, 40], [300, 30]].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="3.5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                      ))}
                    </svg>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 font-mono">
                    <span>Session #037</span>
                    <span>Session #038</span>
                    <span>Session #039</span>
                    <span>Session #040</span>
                    <span>Session #041</span>
                    <span>Session #042 (Latest)</span>
                  </div>
                </div>

                {/* Right Side: Recent Session & Illustrative Recommendation */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Recent Practice snippet */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Session</span>
                      <span className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Today, 7:30 AM
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Morning Riaz — Sustained Notes Drill</p>
                      <p className="text-xs text-slate-500 mt-0.5">35 mins • Sitar / Vocal • Demo Session #042</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-600">Performance Score: <strong className="text-slate-900">88%</strong></span>
                      <NavLink to="/sessions" className="text-primary-600 font-semibold hover:text-primary-700">
                        View Session &rarr;
                      </NavLink>
                    </div>
                  </div>

                  {/* Illustrative Recommendation Card */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Illustrative Recommendation</span>
                      <span className="text-[10px] text-amber-700 font-medium px-1.5 py-0.2 rounded bg-amber-100">
                        Demonstration Insight
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      Example focus area: Upper register transition consistency
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Maintain even volume and steady air pressure/stroke force across upper register intervals in your next practice session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
