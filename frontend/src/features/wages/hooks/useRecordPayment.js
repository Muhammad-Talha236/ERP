import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wageId, amount, type, remarks }) => {
      const response = await api.post(`/wages/${wageId}/payments`, { amount, type, remarks });
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
      queryClient.invalidateQueries({ queryKey: ['wages', variables.wageId, 'payments'] });
    },
  });
}