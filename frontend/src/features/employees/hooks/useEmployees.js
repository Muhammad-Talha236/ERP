import { useQuery } from '@tanstack/react-query';
import { fetchEmployees } from '@/mocks/handlers/employee.mock';

/**
 * useEmployees — fetches the list of employees, optionally filtered
 * by search text, department, or status.
 *
 * SWAPPING TO REAL API LATER: change the import above from
 * '@/mocks/handlers/employee.mock' to '@/api/endpoints/employee.api'.
 * Nothing else in this file — or in any component using this hook —
 * needs to change, since both modules export a fetchEmployees()
 * function with an identical signature and return shape.
 *
 * @param {{ search?: string, department?: string, status?: string }} filters
 */
export function useEmployees(filters = {}) {
  return useQuery({
    // queryKey includes filters so React Query treats each unique
    // filter combination as its own cache entry — e.g. searching
    // "Talha" and clearing the search are cached separately.
    queryKey: ['employees', filters],
    queryFn: () => fetchEmployees(filters),
  });
}

export function useEmployee(id) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => fetchEmployeeById(id),
    // Don't attempt the fetch at all if no id is available yet
    // (e.g. during initial render before route params resolve)
    enabled: Boolean(id),
  });
}