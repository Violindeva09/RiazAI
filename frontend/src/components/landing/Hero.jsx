import { NavLink } from 'react-router-dom';
import Badge from '../common/Badge';

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Subtle geometric background accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-indigo-50/70 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy and CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="primary" className="px-3 py-1 font-semibold text-xs tracking-wider uppercase">
                Personal Music Practice Intelligence
              </Badge>
              <span className="text-xs text-slate-500 hidden sm:inline">• v0.2 Prototype</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Practice with purpose.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                Understand your progress.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              RiazAI helps musicians turn practice sessions into structured insights, consistency tracking, and actionable improvement. Move from isolated, forgotten recordings to compounding mastery.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <NavLink
                to="/analyse"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-sm hover:shadow text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Start Analysing
              </NavLink>
              <NavLink
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                Explore Dashboard
              </NavLink>
            </div>

            {/* Credibility statement */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Heuristic audio engine
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Session consistency logs
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Zero signup required
              </span>
            </div>
          </div>

          {/* Right Column: Visual Product Preview (Demonstration Data) */}
          <div className="lg:col-span-5 relative">
            {/* Demonstration Banner Badge */}
            <div className="mb-2 flex justify-end">
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100/90 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                Interactive product preview • Demonstration data
              </span>
            </div>

            {/* Product card mockup */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Card Top bar */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-700">Latest Practice Session</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Demo Session #042</span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">Morning Riaz — Sustained Notes Drill</h2>
                    <span className="text-xs text-slate-500 font-mono">35m</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Instrument: Vocal / Sitar • Focus: Volume steadiness</p>
                </div>

                {/* Demonstration Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Performance Score</p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-slate-900">88%</span>
                      <span className="text-xs text-emerald-600 font-semibold">+4%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Consistency benchmark</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Session Consistency</p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-slate-900">84%</span>
                      <span className="text-xs text-slate-500 font-medium">High</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Energy stability index</p>
                  </div>
                </div>

                {/* Practice Waveform / Energy visualization mockup */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Audio Practice Signal</span>
                    <span className="text-emerald-400 font-mono">Analyzed</span>
                  </div>
                  {/* Stylized SVG sound bars */}
                  <div className="h-10 flex items-end justify-between gap-1 px-1">
                    {[35, 50, 75, 40, 85, 95, 60, 45, 70, 90, 65, 80, 55, 92, 78, 60, 88, 70, 50, 65, 82, 45].map((val, idx) => (
                      <div
                        key={idx}
                        className="w-full bg-primary-400/80 rounded-t-sm transition-all"
                        style={{ height: `${val}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>0:00</span>
                    <span>Heuristic signal representation</span>
                    <span>35:00</span>
                  </div>
                </div>

                {/* Illustrative Demonstration Insight */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 flex gap-2.5 items-start">
                  <span className="text-amber-600 text-sm mt-0.5">💡</span>
                  <div>
                    <p className="text-xs font-semibold text-amber-900">Illustrative recommendation</p>
                    <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
                      Example focus area: Maintain steady breath control during extended sustained notes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Practice Streak: <strong className="text-slate-800">5 Days</strong></span>
                <NavLink to="/dashboard" className="text-primary-600 font-semibold hover:text-primary-700">
                  Open in Dashboard &rarr;
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
