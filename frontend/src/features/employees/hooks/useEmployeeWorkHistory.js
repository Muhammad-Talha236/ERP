import { useQuery } from '@tanstack/react-query';
import { fetchEmployeeWorkHistory } from '@/mocks/handlers/workHistory.mock';

/**
 * useEmployeeWorkHistory — fetches an employee's work history
 * timeline (hires, promotions, transfers, salary/status changes).
 *
 * SWAPPING TO REAL API: change the import to
 * '@/api/endpoints/workHistory.api' once that file exists and the
 * backend endpoint is live — no other changes needed here.
 *
 * @param {string} employeeId
 */
export function useEmployeeWorkHistory(employeeId) {
  return useQuery({
    queryKey: ['employees', employeeId, 'history'],
    queryFn: () => fetchEmployeeWorkHistory(employeeId),
    enabled: Boolean(employeeId),
  });
}