import { NavLink } from 'react-router-dom';
import { BrandIcon } from '../navigation/NavIcons';

export default function Footer() {
  const productLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Analyse', to: '/analyse' },
    { label: 'Sessions', to: '/sessions' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Goals', to: '/goals' },
    { label: 'Journal', to: '/journal' },
    { label: 'Coach (Roadmap)', to: '/coach' },
  ];

  const accountLinks = [
    { label: 'Musician Profile', to: '/profile' },
    { label: 'Application Settings', to: '/settings' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <NavLink to="/" className="flex items-center gap-2.5 text-white" aria-label="RiazAI Home">
              <BrandIcon className="w-7 h-7 text-primary-500" />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-none">RiazAI</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-0.5">Practice Intelligence</span>
              </div>
            </NavLink>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A personal music practice and analysis platform that helps musicians understand their practice, track consistency, and improve over time.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Milestone 3 Active • Local Prototype Environment</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Practice Platform</p>
            <ul className="space-y-2 text-sm">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Preferences */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Preferences & Profile</p>
            <ul className="space-y-2 text-sm">
              {accountLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="pt-4 text-xs text-slate-500">
              <p className="font-semibold text-slate-400">Heuristic Audio Engine</p>
              <p className="text-[11px] mt-1">Built with React + Tailwind CSS</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 RiazAI. Built for dedicated musicians. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <NavLink to="/dashboard" className="hover:text-slate-300 transition-colors">
              Dashboard
            </NavLink>
            <span>•</span>
            <NavLink to="/analyse" className="hover:text-slate-300 transition-colors">
              Analyse
            </NavLink>
            <span>•</span>
            <NavLink to="/settings" className="hover:text-slate-300 transition-colors">
              Settings
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
