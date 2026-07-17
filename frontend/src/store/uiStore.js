import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * uiStore — miscellaneous global UI state that isn't server data
 * and isn't theme-related.
 *
 * Currently holds: sidebar collapsed/expanded state.
 * Persisted to localStorage so the user's preference survives
 * page refreshes (per the UI doc: "Remember collapsed state").
 */
export const useUIStore = create(
  persist(
    (set, get) => ({
      isSidebarCollapsed: false,

      toggleSidebar: () =>
        set({ isSidebarCollapsed: !get().isSidebarCollapsed }),
    }),
    {
      name: 'ui-storage',
    }
  )
);