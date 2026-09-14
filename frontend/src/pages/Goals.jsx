const GoalsPlaceholder = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Practice Goals</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Set and track your practice objectives</p>
      </div>
      <button className="btn-primary">Create Goal</button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Practice 5 days this week</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Weekly frequency goal</p>
          </div>
          <span className="badge-primary">Active</span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">3 / 5 days</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm flex-1">View Details</button>
          <button className="btn-secondary text-sm flex-1">Log Practice</button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Master Violin Concerto</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Piece mastery goal</p>
          </div>
          <span className="badge-warning">In Progress</span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">45%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-amber-600 h-2 rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm flex-1">View Details</button>
          <button className="btn-secondary text-sm flex-1">Practice Now</button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Improve Intonation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical skill goal</p>
          </div>
          <span className="badge-success">Completed</span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">100%</span>
          </div>
          <div className="w-full bg-emerald-100 rounded-full h-2">
            <div className="bg-emerald-600 h-2 rounded-full w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-sm flex-1">View Details</button>
          <button className="btn-secondary text-sm flex-1">Set New Goal</button>
        </div>
      </div>
    </div>

    <div className="card p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Goal Types</h3>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
        <li><strong>Frequency:</strong> Practice X days per week</li>
        <li><strong>Duration:</strong> Practice X minutes per session</li>
        <li><strong>Piece Mastery:</strong> Learn a specific piece</li>
        <li><strong>Technical:</strong> Improve a specific skill (intonation, rhythm, etc.)</li>
        <li><strong>Consistency:</strong> Maintain a practice streak</li>
      </ul>
    </div>
  </div>
);

export default GoalsPlaceholder;