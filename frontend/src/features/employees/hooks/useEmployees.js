import { useQuery } from '@tanstack/react-query';
import { fetchEmployees } from '@/mocks/handlers/employee.mock';

/**
 * useEmployees — fetches the list of employees, optionally filtered
 * by search text, department, or status.
 *
 * @param {{ search?: string, department?: string, status?: string }} filters
 */
export function useEmployees(filters = {}) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => fetchEmployees(filters),
  });
}