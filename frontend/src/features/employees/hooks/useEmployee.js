import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useEmployee — fetches a single employee's full record by ID.
 * Powers EmployeeRecordPage.jsx.
 *
 * @param {string} id - employee id, typically read from route params
 */
export function useEmployee(id) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: async () => {
      const response = await api.get(`/employees/${id}`);
      return response.employee; // Backend wraps in { success: true, employee: {...} }
    },
    enabled: Boolean(id),
  });
}