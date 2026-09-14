import CapabilityCard from './CapabilityCard';
import { NavIcon } from '../navigation/NavIcons';

export default function CapabilitiesSection() {
  const capabilities = [
    {
      title: 'Audio Analysis',
      description: 'Audio-based practice analysis, performance metrics, and structured session feedback.',
      badgeText: 'Prototype Active',
      badgeVariant: 'success',
      icon: <NavIcon name="analyse" className="w-5 h-5" />,
      currentStatus: 'Heuristic audio-byte amplitude analysis',
    },
    {
      title: 'Practice Tracking',
      description: 'Session logging, practice duration history, routine tracking, and streak measurement.',
      badgeText: 'Core Feature',
      badgeVariant: 'primary',
      icon: <NavIcon name="sessions" className="w-5 h-5" />,
      currentStatus: 'Session history & practice logs',
    },
    {
      title: 'Progress Analytics',
      description: 'Longitudinal consistency trends and milestone measurement across weeks of practice.',
      badgeText: 'Core Feature',
      badgeVariant: 'primary',
      icon: <NavIcon name="analytics" className="w-5 h-5" />,
      currentStatus: 'Session comparison & trend curves',
    },
    {
      title: 'Personalized Insights',
      description: 'Structured focus areas and practice prompts to guide deliberate practice.',
      badgeText: 'Product Direction',
      badgeVariant: 'warning',
      icon: <NavIcon name="goals" className="w-5 h-5" />,
      currentStatus: 'Guided focus & journal reflections',
    },
  ];

  return (
    <section id="capabilities" className="py-20 sm:py-28 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/80 text-primary-800 text-xs font-semibold uppercase tracking-wider">
            <span>Product Framework</span>
            <span className="w-1 h-1 rounded-full bg-primary-600" />
            <span>4 Core Capabilities</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for deliberate, structured practice.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            RiazAI provides a reliable foundation to record, analyse, and track your practice sessions over time.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap) => (
            <CapabilityCard key={cap.title} {...cap} />
          ))}
        </div>

        {/* Credibility & Roadmap Box: Current Reality vs. Future Roadmap */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2 md:max-w-md">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Credibility & Scope</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Engineering Transparency
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Current Heuristic Engine vs. Roadmap</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe in total transparency with musicians. Here is what RiazAI implements today versus our technical roadmap:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 flex-1">
              {/* Current Reality */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Current Prototype State</p>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Heuristic audio analysis using raw audio-byte amplitude & energy</li>
                  <li>Performance score and session consistency metrics</li>
                  <li>Practice session logging and time duration tracking</li>
                  <li>Practice streak and journal reflection notes</li>
                </ul>
              </div>

              {/* Future Roadmap */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Future Product Roadmap</p>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Fundamental frequency (F0) & pitch estimation models</li>
                  <li>Intonation analysis & microtonal sruti benchmarking</li>
                  <li>Rhythm tracking & tempo consistency analysis</li>
                  <li>AI-assisted deliberate practice coaching recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
