import { useTheme } from '../context/ThemeContext';

const SettingsPlaceholder = () => {
  const { preference, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  return (
  <div className="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-1">Configure your RiazAI experience</p>
    </div>

    <div className="card">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Appearance</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Theme</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred color scheme</p>
          </div>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  preference === opt.value
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'btn-ghost'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
      </div>
      <div className="p-6 space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Practice Reminders</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Get reminded to practice daily</p>
          </div>
          <input type="checkbox" className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500" defaultChecked />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Goal Progress Updates</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications when you make progress</p>
          </div>
          <input type="checkbox" className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500" defaultChecked />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Weekly Summary</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Get a weekly recap of your practice</p>
          </div>
          <input type="checkbox" className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
        </label>
      </div>
    </div>

    <div className="card">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Practice Preferences</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="pref-instrument" className="label">Default Instrument</label>
          <select id="pref-instrument" className="input">
            <option>Violin</option>
            <option>Piano</option>
            <option>Voice</option>
            <option>Guitar</option>
            <option>Cello</option>
            <option>Flute</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="pref-reminder-time" className="label">Daily Reminder Time</label>
          <input type="time" id="pref-reminder-time" className="input" defaultValue="19:00" />
        </div>
        <div>
          <label htmlFor="pref-session-target" className="label">Default Session Target (minutes)</label>
          <input type="number" id="pref-session-target" className="input" defaultValue="45" min="5" max="300" />
        </div>
      </div>
    </div>

    <div className="card">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Data Management</h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Reset Demo Data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Clear all local demo data and start fresh</p>
          </div>
          <button className="btn-ghost text-rose-600 hover:bg-rose-50 hover:text-rose-700">Reset</button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Export Data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Download your practice data as JSON</p>
          </div>
          <button className="btn-secondary">Export</button>
        </div>
      </div>
    </div>

    <div className="card p-6 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-800">
      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">About</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        RiazAI v0.1.0 (Frontend Foundation) &middot; Personal Music Practice & Analysis Platform
      </p>
    </div>
  </div>
  );
};

export default SettingsPlaceholder;