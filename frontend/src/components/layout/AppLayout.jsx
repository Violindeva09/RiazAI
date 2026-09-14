import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import Topbar from '../navigation/Topbar';
import MobileNavigation from '../navigation/MobileNavigation';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Mobile Navigation Drawer (Mobile & Tablet < lg) */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Persistent Desktop Sidebar (Desktop lg+) */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:flex lg:flex-col">
        <Sidebar />
      </div>

      {/* Main Content Column */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        <footer className="py-4 px-6 border-t border-slate-200/60 bg-white/40 text-center text-xs text-slate-400 dark:bg-slate-900/40 dark:border-slate-800/60 dark:text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>RiazAI — Personal Music Practice Intelligence (Prototype)</p>
            <p className="text-[11px] text-slate-400">Demonstration UI & Heuristic Audio Engine</p>
          </div>
        </footer>
      </div>
    </div>
  );
}