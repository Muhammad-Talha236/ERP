import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useEmployees — fetches the list of employees, optionally filtered
 * by search text, department, or status.
 *
 * @param {{ search?: string, department?: string, status?: string }} filters
 */
export function useEmployees(filters = {}) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => {
      const response = await api.get('/employees', { params: filters });
      return response.employees; // Backend returns { success: true, employees: [...] }
    },
  });
}