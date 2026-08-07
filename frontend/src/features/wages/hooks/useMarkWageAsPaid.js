import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useMarkWageAsPaid — mutation hook for paying ONE specific
 * employee's wage record from the real backend.
 */
export function useMarkWageAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wageId, amount, type, remarks }) => {
      const response = await api.post(`/wages/${wageId}/payments`, { amount, type, remarks });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
    },
  });
}