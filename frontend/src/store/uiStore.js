import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * uiStore — miscellaneous global UI state that isn't server data
 * and isn't theme-related.
 *
 * - isSidebarCollapsed: desktop/tablet collapse toggle (persisted)
 * - isMobileMenuOpen: phone-only off-canvas drawer state (NOT
 *   persisted — always starts closed on page load/refresh, so a
 *   refresh never leaves the overlay stuck open behind the page)
 */
export const useUIStore = create(
  persist(
    (set, get) => ({
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,

      toggleSidebar: () =>
        set({ isSidebarCollapsed: !get().isSidebarCollapsed }),

      toggleMobileMenu: () =>
        set({ isMobileMenuOpen: !get().isMobileMenuOpen }),

      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
);