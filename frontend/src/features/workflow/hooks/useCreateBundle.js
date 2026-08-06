import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/api';

export function useCreateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ poNumber, quantity, stageName }) => {
      const data = await post('/workflows/bundles', { poNumber, quantity, stageName });
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', variables.poNumber, 'bundles'] });
      queryClient.invalidateQueries({ queryKey: ['productionOrders', variables.poNumber, 'movements'] });
    },
  });
}
