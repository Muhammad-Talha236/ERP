import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAttendance } from '@/api/endpoints/attendance.api';

export function useUpdateAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }) => updateAttendance(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}