export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Practice',
      description: 'Record or perform your daily riaz routine, instrument drills, or vocal exercises in your practice space.',
      detail: 'Supports WAV/MP3 uploads and live microphone input.',
    },
    {
      number: '02',
      title: 'Analyse',
      description: 'The heuristic engine computes performance scores, signal stability, and volume consistency metrics.',
      detail: 'Fast client-side and server-assisted processing.',
    },
    {
      number: '03',
      title: 'Understand',
      description: 'Review visualized session summaries, longitudinal consistency trends, and practice journal reflections.',
      detail: 'Compare runs to spot patterns across multiple days.',
    },
    {
      number: '04',
      title: 'Improve',
      description: 'Apply structured adjustments in your next session to overcome plateaus and build progressive mastery.',
      detail: 'Close the loop between practice and objective feedback.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">Deliberate Practice Loop</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How RiazAI works.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A continuous cycle designed to transform repetitive practice into deliberate musical improvement.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative group">
              {/* Connector line for desktop */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-7 left-14 w-[calc(100%-3.5rem)] h-0.5 bg-slate-200 -z-0"
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 flex flex-col space-y-4">
                {/* Step badge */}
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-primary-500/80 text-primary-700 flex items-center justify-center font-bold text-lg shadow-sm group-hover:border-primary-600 group-hover:bg-primary-50/50 transition-colors">
                  {step.number}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
