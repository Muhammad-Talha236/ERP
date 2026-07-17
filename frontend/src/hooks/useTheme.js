import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

/**
 * useTheme()
 *
 * The single hook components use to read/control the app's theme.
 * Wraps the Zustand themeStore and keeps the <html> element's
 * `.dark` class in sync with the store's value.
 *
 * Why the useEffect here (and not just in main.jsx)?
 * main.jsx only sets the class ONCE at boot, before React renders.
 * This hook keeps it in sync on every subsequent change — e.g. when
 * the user clicks the ThemeToggle button mid-session, this effect
 * re-runs and updates the DOM class immediately.
 *
 * @returns {{ theme: 'light'|'dark', toggleTheme: () => void, setTheme: (t: string) => void }}
 */
export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    // Keep <html class="dark"> in sync whenever `theme` changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme, setTheme };
}