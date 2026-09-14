import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { getRouteMetadata } from './navConfig';
import { BrandIcon, NavIcon } from './NavIcons';
import ThemeToggle from '../common/ThemeToggle';

export default function Topbar({ onMenuClick }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const meta = getRouteMetadata(location.pathname);

  // Close menus on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setNotifMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Update document title dynamically
  useEffect(() => {
    document.title = `${meta.title} | RiazAI`;
  }, [meta.title]);

  const handleSignOut = () => {
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left side: Mobile menu toggle + Dynamic page title / breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Open mobile navigation drawer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile brand fallback if needed */}
          <NavLink
            to="/"
            className="lg:hidden flex items-center gap-2 mr-1 shrink-0 text-slate-900"
            aria-label="RiazAI Home"
          >
            <BrandIcon className="w-6 h-6 text-primary-600" />
            <span className="font-semibold text-sm tracking-tight">RiazAI</span>
          </NavLink>

          {/* Breadcrumbs & Page Header */}
          <div className="min-w-0 hidden sm:block">
            {meta.breadcrumbs && meta.breadcrumbs.length > 1 ? (
              <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                {meta.breadcrumbs.map((crumb, idx) => (
                  <span key={crumb.to} className="flex items-center gap-1.5">
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    {idx === meta.breadcrumbs.length - 1 ? (
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{crumb.label}</span>
                    ) : (
                      <NavLink
                        to={crumb.to}
                        className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors truncate"
                      >
                        {crumb.label}
                      </NavLink>
                    )}
                  </span>
                ))}
              </nav>
            ) : null}
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                {meta.title}
              </h1>
              {meta.badge && (
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  {meta.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Theme toggle, Quick links, Notifications & User profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Quick link to Landing page for convenience */}
          <NavLink
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Landing Page
          </NavLink>

          {/* Quick practice action */}
          <NavLink
            to="/analyse"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-xs dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <NavIcon name="analyse" className="w-3.5 h-3.5" />
            <span>New Practice</span>
          </NavLink>

          {/* Notifications Popover */}
          <div className="relative" ref={notifMenuRef}>
            <button
              type="button"
              onClick={() => {
                setNotifMenuOpen((prev) => !prev);
                setUserMenuOpen(false);
              }}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Notifications"
              aria-expanded={notifMenuOpen}
              aria-haspopup="true"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white" aria-hidden="true" />
            </button>

            {notifMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in duration-100 dark:bg-slate-900 dark:border-slate-800"
                role="dialog"
                aria-label="Practice Notifications"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notifications</span>
                  <span className="text-[11px] text-primary-600 font-medium">Prototype alerts</span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">Practice streak maintained</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">5 consecutive days logged</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">Milestone 3 active</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Navigation shell and landing page refined</p>
                    </div>
                  </div>
                </div>
                <div className="px-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <NavLink
                    to="/sessions"
                    onClick={() => setNotifMenuOpen(false)}
                    className="block text-center text-xs font-medium text-primary-600 hover:text-primary-700 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    View Practice Sessions &rarr;
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen((prev) => !prev);
                setNotifMenuOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Musician profile menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-xs flex items-center justify-center border border-primary-200/80">
                RA
              </div>
              <span className="hidden sm:block text-xs font-medium text-slate-700 dark:text-slate-300">Musician</span>
              <svg className="w-3.5 h-3.5 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in duration-100 dark:bg-slate-900 dark:border-slate-800"
                role="menu"
                aria-label="User menu options"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Riaz Musician</p>
                  <p className="text-[11px] text-slate-400 truncate">demo.musician@riazai.app</p>
                </div>
                <div className="py-1">
                  <NavLink
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    role="menuitem"
                  >
                    <NavIcon name="profile" className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    Musician Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    role="menuitem"
                  >
                    <NavIcon name="settings" className="w-4 h-4 text-slate-400" />
                    Preferences & Audio
                  </NavLink>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left"
                    role="menuitem"
                  >
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Return to Landing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}