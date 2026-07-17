import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAttendance } from '@/mocks/handlers/attendance.mock';

/**
 * useMarkAttendance — mutation hook for recording a new attendance
 * entry (Mark Attendance form/modal).
 */
export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}