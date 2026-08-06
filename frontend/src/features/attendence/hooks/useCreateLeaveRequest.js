import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLeaveRequest } from '@/api/endpoints/attendance.api';

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    },
  });
}