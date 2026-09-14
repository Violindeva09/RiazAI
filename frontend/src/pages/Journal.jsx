const JournalPlaceholder = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Practice Journal</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Reflect on your practice sessions and track insights</p>
      </div>
      <button className="btn-primary">New Entry</button>
    </div>

    <div className="card">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="journal-date" className="label">Date</label>
              <input type="date" id="journal-date" className="input" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label htmlFor="journal-instrument" className="label">Instrument</label>
              <select id="journal-instrument" className="input">
                <option>Violin</option>
                <option>Piano</option>
                <option>Voice</option>
                <option>Guitar</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="journal-duration" className="label">Duration (minutes)</label>
            <input type="number" id="journal-duration" className="input" placeholder="45" min="1" />
          </div>
          <div>
            <label htmlFor="journal-practiced" className="label">What I Practiced</label>
            <textarea id="journal-practiced" className="input min-h-[100px] resize-y" placeholder="Scales, etudes, pieces..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="journal-well" className="label">What Went Well</label>
              <textarea id="journal-well" className="input min-h-[80px] resize-y" placeholder="Technique breakthroughs, musical moments..." />
            </div>
            <div>
              <label htmlFor="journal-improve" className="label">Needs Improvement</label>
              <textarea id="journal-improve" className="input min-h-[80px] resize-y" placeholder="Areas to focus on next time..." />
            </div>
          </div>
          <div>
            <label htmlFor="journal-mood" className="label">Mood / Energy</label>
            <select id="journal-mood" className="input">
              <option>😊 Energised</option>
              <option>😐 Neutral</option>
              <option>😔 Tired</option>
              <option>😤 Frustrated</option>
              <option>😌 Calm</option>
            </select>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="submit" className="btn-primary">Save Entry</button>
          </div>
        </form>
      </div>
    </div>

    <div className="card">
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">No journal entries yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Your practice reflections will appear here</p>
        </div>
      </div>
    </div>
  </div>
);

export default JournalPlaceholder;