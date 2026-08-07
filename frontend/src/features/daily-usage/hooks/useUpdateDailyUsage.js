import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useUpdateDailyUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await api.put(`/daily-usage/${id}`, updates);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-usage'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}