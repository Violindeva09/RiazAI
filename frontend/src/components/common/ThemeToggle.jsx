import { useTheme } from '../../context/ThemeContext';

/**
 * Theme toggle button that cycles through light -> dark -> system.
 */
export default function ThemeToggle({ className = '' }) {
  const { preference, setTheme } = useTheme();

  const cycle = () => {
    const next = preference === 'light' ? 'dark' : preference === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const labels = {
    light: 'Theme: Light (click to switch to dark)',
    dark: 'Theme: Dark (click to switch to system)',
    system: 'Theme: System (click to switch to light)',
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className={`p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${className}`}
      aria-label={labels[preference]}
      title={labels[preference]}
    >
      {preference === 'light' && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
      {preference === 'dark' && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      {preference === 'system' && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}
