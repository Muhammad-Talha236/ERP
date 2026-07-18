import { useQuery } from '@tanstack/react-query';
import { fetchDailyUsage } from '@/mocks/handlers/dailyUsage.mock';

/**
 * useDailyUsage — fetches material usage entries, optionally
 * filtered by date range.
 *
 * @param {{ from?: string, to?: string }} filters
 */
export function useDailyUsage(filters = {}) {
  return useQuery({
    queryKey: ['dailyUsage', filters],
    queryFn: () => fetchDailyUsage(filters),
  });
}