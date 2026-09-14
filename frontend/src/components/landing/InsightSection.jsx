import { NavLink } from 'react-router-dom';

export default function InsightSection() {
  const steps = [
    {
      stage: 'Session',
      title: 'Individual Riaz Recording',
      description: 'Capture raw practice audio, duration, and immediate heuristic energy stability metrics.',
      icon: (
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      stage: 'Trend',
      title: 'Longitudinal Patterns',
      description: 'Aggregate sessions across days and weeks to reveal true consistency rather than daily mood.',
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      stage: 'Goal',
      title: 'Targeted Practice Routines',
      description: 'Set structured targets for weekly riaz duration, consistency scores, and milestone pieces.',
      icon: (
        <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      stage: 'Improvement',
      title: 'Compounding Mastery',
      description: 'Convert hundreds of practice hours into measurable, lasting musical progress and confidence.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="progress" className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">The Long-Term Value</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            From isolated recordings to lifelong mastery.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Recordings on your phone sit unlistened. RiazAI connects individual practice sessions into a cumulative trajectory of growth.
          </p>
        </div>

        {/* Conceptual flow: Session -> Trend -> Goal -> Improvement */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={item.stage}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Step {idx + 1}</span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600">{item.stage}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                <span>Progressive stage</span>
                <span className="font-semibold text-slate-600">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold">Ready to see how deliberate practice transforms your playing?</h4>
            <p className="text-sm text-slate-300">
              Try the local analysis prototype today with your own audio file or microphone.
            </p>
          </div>
          <NavLink
            to="/analyse"
            className="px-5 py-3 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors shadow-sm shrink-0"
          >
            Start Practice Session &rarr;
          </NavLink>
        </div>
      </div>
    </section>
  );
}
