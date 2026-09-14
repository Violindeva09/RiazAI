import { NavLink } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 -z-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/60 border border-primary-700/60 text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <span>Start Practice Today</span>
          <span className="w-1 h-1 rounded-full bg-primary-400" />
          <span>Local Prototype v0.2</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Your practice deserves more than a recording.
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Transform your daily riaz into clear benchmarks, deliberate focus areas, and compounding consistency over time.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NavLink
            to="/analyse"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          >
            Start Your Practice Journey
          </NavLink>
          <NavLink
            to="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Explore the Dashboard
          </NavLink>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Instant browser access
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No account required
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Interactive demonstration data
          </span>
        </div>
      </div>
    </section>
  );
}
