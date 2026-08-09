import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useWages — fetches wage/payroll records, optionally filtered by
 * employee or payment status from the real backend.
 * 
 * @param {{ employeeId?: string, status?: string }} filters
 */
export function useWages(filters = {}) {
  return useQuery({
    queryKey: ['wages', filters],
    queryFn: async () => {
      const response = await api.get('/wages', { params: filters }); // now also accepts payrollStatus, month, year
      return response.wages || response.data || response;
    },
  });
}