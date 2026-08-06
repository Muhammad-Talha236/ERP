import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates, status }) => {
      let payload = {};
      
      if (status) {
        payload = { status };
      } else if (updates) {
        payload = { ...updates, status: 'Pending' };
      }

      const response = await api.patch(`/attendance/leave-requests/${id}`, payload);
      return response.leaveRequest;
    },
    onSuccess: () => {
      // Dono keys ko forcefully refetch karein taake UI par foran updated data nazar aaye
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['attendance'], exact: false });
    },
  });
}