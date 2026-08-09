import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useGeneratePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/wages/generate', payload);
      return response.wage || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
      queryClient.invalidateQueries({ queryKey: ['wagesOverview'] });
    },
  });
}