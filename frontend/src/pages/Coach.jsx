const CoachPlaceholder = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">AI Coach</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-1">Personalised guidance based on your practice history and analysis results</p>
    </div>

    <div className="card p-6 bg-primary-50 border-primary-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m10-14v4m-2-2h4m-10 10v4m0-4h4m0 10v4m-2-2h4" />
          </svg>
        </div>
        <div className="flex-1">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200">AI Coaching Coming Soon</h3>
        <p className="text-primary-700 dark:text-primary-300 mt-1">
            This feature will use your practice history and analysis results to provide personalised guidance,
            practice recommendations, and intelligent insights tailored to your musical journey.
          </p>
        </div>
        <span className="badge-primary mt-1">Future Feature</span>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Recent Insights</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Complete your first analysis to unlock personalised insights</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Suggested Focus</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload a practice recording to receive targeted recommendations</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Practice Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">AI will suggest exercises based on your weak areas</p>
          </div>
        </div>
      </div>
    </div>

    <div className="card p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Planned AI Capabilities</h3>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
        <li>Automatic identification of technical weaknesses from audio analysis</li>
        <li>Personalised exercise recommendations based on error patterns</li>
        <li>Practice scheduling optimisation</li>
        <li>Progress prediction and goal adjustment</li>
        <li>Comparative analysis with pedagogical benchmarks</li>
        <li>Natural language feedback and encouragement</li>
      </ul>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        <em>Note: This is a planned future feature. No AI inference is currently implemented.</em>
      </p>
    </div>
  </div>
);

export default CoachPlaceholder;