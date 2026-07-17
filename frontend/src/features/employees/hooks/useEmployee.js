import { useQuery } from '@tanstack/react-query';
import { fetchEmployeeById } from '@/mocks/handlers/employee.mock';

/**
 * useEmployee — fetches a single employee's full record by ID.
 * Powers EmployeeRecordPage.jsx.
 *
 * @param {string} id - employee id, typically read from route params
 */
export function useEmployee(id) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => fetchEmployeeById(id),
    enabled: Boolean(id),
  });
}