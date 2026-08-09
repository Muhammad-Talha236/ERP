import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useApproveWage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wageId) => {
      const response = await api.patch(`/wages/${wageId}/approve`);
      return response.wage || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
    },
  });
}