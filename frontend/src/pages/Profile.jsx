const ProfilePlaceholder = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your musician profile and preferences</p>
    </div>

    <div className="card p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <button className="btn-secondary absolute bottom-0 right-0 -mb-2 -mr-2 text-sm">Change</button>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Musician</h2>
          <p className="text-slate-500 dark:text-slate-400">musician@riazai.app</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="profile-name" className="label">Full Name</label>
            <input type="text" id="profile-name" className="input" defaultValue="Musician" />
          </div>
          <div>
            <label htmlFor="profile-instrument" className="label">Primary Instrument</label>
            <select id="profile-instrument" className="input">
              <option>Violin</option>
              <option>Piano</option>
              <option>Voice</option>
              <option>Guitar</option>
              <option>Cello</option>
              <option>Flute</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="profile-level" className="label">Skill Level</label>
            <select id="profile-level" className="input">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Professional</option>
            </select>
          </div>
          <div>
            <label htmlFor="profile-goal" className="label">Practice Goal</label>
            <input type="text" id="profile-goal" className="input" placeholder="e.g., Master Violin Concerto in D Major" />
          </div>
        </div>

        <div>
          <label htmlFor="profile-bio" className="label">Short Bio</label>
          <textarea id="profile-bio" className="input min-h-[100px] resize-y" placeholder="Tell us about your musical journey..." />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="submit" className="btn-primary">Save Profile</button>
        </div>
      </form>
    </div>
  </div>
);

export default ProfilePlaceholder;