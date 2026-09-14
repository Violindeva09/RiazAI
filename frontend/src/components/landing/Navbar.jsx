import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { BrandIcon } from '../navigation/NavIcons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Problem', href: '#problem' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Dashboard Preview', href: '#preview' },
    { label: 'Long-term Value', href: '#progress' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
          : 'bg-white/80 backdrop-blur-xs border-b border-slate-200/40 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="RiazAI Home"
          >
            <BrandIcon className="w-8 h-8 text-primary-600" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">RiazAI</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">Practice Intelligence</span>
            </div>
          </NavLink>

          {/* Desktop Anchor Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Landing Page Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <NavLink
              to="/dashboard"
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Explore Dashboard
            </NavLink>
            <NavLink
              to="/analyse"
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Start Analysing
            </NavLink>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={mobileMenuOpen ? 'Close landing navigation' : 'Open landing navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-2 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-150">
            <nav className="flex flex-col space-y-1" aria-label="Mobile Landing Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Explore Dashboard
              </NavLink>
              <NavLink
                to="/analyse"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-xs"
              >
                Start Analysing
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
