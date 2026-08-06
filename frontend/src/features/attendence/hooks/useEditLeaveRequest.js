import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editLeaveRequest } from '@/api/endpoints/attendance.api';

export function useEditLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => editLeaveRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    },
  });
}