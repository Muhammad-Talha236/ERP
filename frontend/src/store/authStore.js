import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * authStore — single source of truth for the logged-in user and
 * their access token.
 *
 * Persisted to localStorage so refreshing the page doesn't log the
 * user out. The apiClient.js interceptor also reads
 * localStorage.getItem('accessToken') directly for the Authorization
 * header — we keep BOTH in sync here (setUser also mirrors the
 * token into that same localStorage key) so the two systems never
 * drift apart once a real backend is connected.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      /**
       * setSession — called right after a successful login/signup.
       * @param {{ user: object, accessToken: string }} session
       */
      setSession: ({ user, accessToken }) => {
        localStorage.setItem('accessToken', accessToken);
        set({ user, accessToken });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

/**
 * Convenience selectors, so components don't need to know the
 * store's internal shape.
 */
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => Boolean(state.user));