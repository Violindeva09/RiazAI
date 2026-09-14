import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ThemeContext = createContext(undefined);
const THEME_KEY = 'riazai_theme';

function readStoredPreference() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch { /* ignore */ }
  return 'system';
}

function resolveEffective(preference) {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyClass(effective) {
  const root = document.documentElement;
  if (effective === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readStoredPreference);

  // Apply theme synchronously on every render (not just in useEffect)
  const effective = resolveEffective(preference);
  applyClass(effective);

  // Also apply on mount via useEffect as a safety net
  useEffect(() => {
    applyClass(effective);
  }, [effective]);

  // Listen for OS preference changes when in 'system' mode
  useEffect(() => {
    if (preference !== 'system') return;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const handler = () => applyClass(resolveEffective('system'));
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  const setTheme = useCallback((next) => {
    if (next !== 'light' && next !== 'dark' && next !== 'system') return;
    setPreference(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
    applyClass(resolveEffective(next));
  }, []);

  const value = useRef({ preference, effective, setTheme });
  value.current = { preference, effective, setTheme };

  return (
    <ThemeContext.Provider value={value.current}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx) return ctx;
  // Fallback for components rendered outside provider (shouldn't happen)
  return {
    preference: 'system',
    effective: typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    setTheme: () => {},
  };
}
