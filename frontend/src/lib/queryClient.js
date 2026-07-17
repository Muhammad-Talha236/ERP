import { QueryClient } from '@tanstack/react-query';

/**
 * The single QueryClient instance for the whole app.
 * Provided at the root in main.jsx via <QueryClientProvider>.
 *
 * Default options explained:
 *
 * - staleTime: how long fetched data is considered "fresh" before
 *   React Query will refetch it in the background. 60s is a reasonable
 *   default for ERP data (employee lists, materials) that doesn't
 *   change every second — avoids hammering the API unnecessarily.
 *
 * - retry: how many times a failed request auto-retries before
 *   showing an error state. 1 retry is enough for transient network
 *   blips without making failures feel slow.
 *
 * - refetchOnWindowFocus: disabled for now. In production ERPs this
 *   is often useful (e.g. re-check stock when the user tabs back in),
 *   but during development it causes constant refetching that's
 *   distracting. We can re-enable per-query later where it matters.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});