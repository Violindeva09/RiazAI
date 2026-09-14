export default function ProblemSection() {
  const problems = [
    {
      number: '01',
      title: 'Vanished Practice History',
      description:
        'Musicians play for hundreds of hours into empty rooms. Once the instrument is put down, the nuances of the session vanish into memory without an ongoing record.',
    },
    {
      number: '02',
      title: 'Subjective Self-Evaluation',
      description:
        'Relying purely on fatigue or mood makes it difficult to assess true performance. Without objective benchmarks, understanding what actually improved remains guesswork.',
    },
    {
      number: '03',
      title: 'Consistency Blindspots',
      description:
        'Are sustained notes steadier than last week? Is volume control more even during long scales? Without longitudinal data, consistency trends stay invisible.',
    },
    {
      number: '04',
      title: 'Disconnected Repetition',
      description:
        'Practicing without structured focus areas often leads to mindless repetition and frustrating plateaus rather than targeted, deliberate musical growth.',
    },
  ];

  return (
    <section id="problem" className="py-20 sm:py-28 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600">The Musician's Dilemma</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hours of practice. Very little measurable feedback.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Deliberate practice requires clear feedback loops. Yet most musicians practice repeatedly without a structured way to track consistency over time.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item) => (
            <div
              key={item.number}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-primary-600 px-2.5 py-1 rounded bg-primary-50 border border-primary-100/80 inline-block">
                  {item.number}
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-6 border-t border-slate-200/60 mt-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unaddressed Challenge</span>
              </div>
            </div>
          ))}
        </div>

        {/* Closing summary quote */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-300 uppercase tracking-wider">The Solution</p>
            <p className="text-base sm:text-lg font-medium text-slate-100 mt-0.5">
              RiazAI bridges the gap between raw intuition and structured practice data.
            </p>
          </div>
          <a
            href="#capabilities"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shrink-0"
          >
            See Core Capabilities &darr;
          </a>
        </div>
      </div>
    </section>
  );
}
