import { useQuery } from '@tanstack/react-query';
import { fetchAttendance } from '@/mocks/handlers/attendance.mock';

/**
 * useAttendance — fetches attendance records, optionally filtered
 * by date, employeeId, or month/year.
 *
 * SWAPPING TO REAL API: change the import to
 * '@/api/endpoints/attendance.api' once that file/endpoint exists.
 *
 * @param {{ date?: string, employeeId?: string, month?: number, year?: number }} filters
 */
export function useAttendance(filters = {}) {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: () => fetchAttendance(filters),
  });
}