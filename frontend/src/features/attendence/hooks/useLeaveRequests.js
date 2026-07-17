import { useQuery } from '@tanstack/react-query';
import { fetchLeaveRequests } from '@/mocks/handlers/attendance.mock';

/**
 * useLeaveRequests — fetches the list of leave requests shown in
 * the "Leave Requests" table on the Attendance page.
 */
export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leaveRequests'],
    queryFn: fetchLeaveRequests,
  });
}