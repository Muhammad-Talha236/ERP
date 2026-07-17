import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme store — single source of truth for light/dark mode.
 *
 * Uses Zustand's `persist` middleware to automatically save the
 * theme choice to localStorage under the key "theme-storage", and
 * rehydrate it on page load — so the user's preference survives
 * refreshes and new sessions.
 *
 * IMPORTANT: this store only tracks the *value* ('light' | 'dark').
 * Actually applying the `.dark` class to <html> happens separately
 * in useTheme.js (a hook we'll build next), which reacts to changes
 * in this store. Keeping the store "dumb" (just data) and the DOM
 * side-effect in a hook is a clean separation of concerns.
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark', // default theme, matches your design screenshots

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'theme-storage', // localStorage key
    }
  )
);