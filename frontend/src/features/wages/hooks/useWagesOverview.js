import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useWagesOverview — every employee for the given month/year, with
 * their wage record (if generated) joined in. Powers the payroll
 * table so employees without a generated payroll still show up with
 * their base salary and status.
 */
export function useWagesOverview({ month, year } = {}) {
  return useQuery({
    queryKey: ['wagesOverview', month, year],
    queryFn: async () => {
      const response = await api.get('/wages/overview', { params: { month, year } });
      return response.overview || [];
    },
  });
}