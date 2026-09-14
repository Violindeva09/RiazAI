import { NavLink } from 'react-router-dom';
import { NAV_SECTIONS } from './navConfig';
import { BrandIcon, NavIcon } from './NavIcons';

export default function Sidebar({ className = '' }) {
  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 flex flex-col h-full select-none dark:bg-slate-900 dark:border-slate-800 ${className}`}
      aria-label="Main Navigation"
    >
      {/* Brand header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200/80 dark:border-slate-700/80">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5 rounded-lg text-slate-900 dark:text-slate-100 hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="RiazAI Dashboard"
        >
          <BrandIcon className="w-7 h-7 text-primary-600" />
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-none">RiazAI</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">Practice Intelligence</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Primary Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {NAV_SECTIONS.primary.label}
          </div>
          <nav className="space-y-0.5" aria-label="Primary Navigation">
            {NAV_SECTIONS.primary.items.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`transition-colors shrink-0 ${
                          isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                        }`}
                      >
                        <NavIcon name={item.iconName} className="w-4 h-4" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {NAV_SECTIONS.secondary.label}
          </div>
          <nav className="space-y-0.5" aria-label="Account Navigation">
            {NAV_SECTIONS.secondary.items.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-colors shrink-0 ${
                        isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    >
                      <NavIcon name={item.iconName} className="w-4 h-4" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Musician Profile & Prototype Status Footer */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all text-left group"
          aria-label="Musician Profile"
        >
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-xs border border-primary-200/60 shrink-0">
            RA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary-700 dark:group-hover:text-primary-300">Riaz Musician</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">Vocal / Sitar</p>
          </div>
        </NavLink>
        <div className="mt-2 px-2 py-1.5 rounded bg-slate-100/80 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Local Prototype
          </span>
          <span className="text-[10px] text-slate-400">v0.2</span>
        </div>
      </div>
    </aside>
  );
}