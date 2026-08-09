import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ transactionId, ...updates }) => {
      const response = await api.put(`/wages/payments/${transactionId}`, updates);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
      queryClient.invalidateQueries({ queryKey: ['wagesOverview'] });
      if (data?.wage?.id) {
        queryClient.invalidateQueries({ queryKey: ['wages', data.wage.id, 'payments'] });
      }
    },
  });
}