import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'practice-sheet-theme';

function applyTheme(mode: ThemeMode): void {
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  if (mode === 'dark') html.classList.add('dark');
  else if (mode === 'light') html.classList.add('light');
  // 'system' → no class; CSS media query handles it
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored && (['system', 'light', 'dark'] as ThemeMode[]).includes(stored)
      ? stored
      : 'system';
  });

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);

    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);

  const cycleTheme = useCallback(() => {
    setModeState((prev) => {
      const next: Record<ThemeMode, ThemeMode> = { system: 'light', light: 'dark', dark: 'system' };
      return next[prev];
    });
  }, []);

  return { mode, setMode, cycleTheme };
}
