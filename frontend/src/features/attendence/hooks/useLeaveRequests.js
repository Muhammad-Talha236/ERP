import { useQuery } from '@tanstack/react-query';
import { fetchLeaveRequests } from '@/api/endpoints/attendance.api';

export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leaveRequests'],
    queryFn: fetchLeaveRequests,
  });
}