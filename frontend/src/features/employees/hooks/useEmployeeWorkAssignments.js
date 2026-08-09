import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useEmployeeWorkAssignments — fetches an employee's real production
 * work (workflow / bundle stage assignments), powering the
 * "Production Work" section on the Employee Record page.
 *
 * @param {string} employeeId
 */
export function useEmployeeWorkAssignments(employeeId) {
  return useQuery({
    queryKey: ['employees', employeeId, 'work'],
    queryFn: async () => {
      const response = await api.get(`/employees/${employeeId}/work`);
      return response.work || [];
    },
    enabled: Boolean(employeeId),
  });
}