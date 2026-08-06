import { useQuery } from '@tanstack/react-query';
import { fetchAttendance } from '@/api/endpoints/attendance.api';

export function useAttendance(filters = {}) {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: () => fetchAttendance(filters),
  });
}