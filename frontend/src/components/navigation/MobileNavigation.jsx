import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_SECTIONS } from './navConfig';
import { BrandIcon, NavIcon } from './NavIcons';
import ThemeToggle from '../common/ThemeToggle';

export default function MobileNavigation({ isOpen, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out dark:bg-slate-900">
        {/* Header */}
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 text-slate-900 hover:text-primary-600 transition-colors"
            aria-label="RiazAI Home"
          >
            <BrandIcon className="w-7 h-7 text-primary-600" />
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-slate-900 leading-none">RiazAI</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">Practice Intelligence</span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Close navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Primary group */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {NAV_SECTIONS.primary.label}
            </p>
            <nav className="space-y-1" aria-label="Mobile Primary Navigation">
              {NAV_SECTIONS.primary.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-primary-600' : 'text-slate-400'}>
                          <NavIcon name={item.iconName} className="w-5 h-5" />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Secondary group */}
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {NAV_SECTIONS.secondary.label}
            </p>
            <nav className="space-y-1" aria-label="Mobile Account Navigation">
              {NAV_SECTIONS.secondary.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-primary-600' : 'text-slate-400'}>
                        <NavIcon name={item.iconName} className="w-5 h-5" />
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/75 space-y-3 dark:bg-slate-800/50 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ThemeToggle className="flex-1 justify-center py-2.5 min-h-[44px]" />
            <NavLink
              to="/"
              onClick={onClose}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 min-h-[44px] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              View Public Landing Page
            </NavLink>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              RiazAI Prototype
            </span>
            <span className="text-[11px] text-slate-400">Local Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}