import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useDeleteBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bundleId }) => {
      const response = await api.delete(`/workflows/bundles/${bundleId}`);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
      if (variables?.orderId) {
        queryClient.invalidateQueries({ queryKey: ['productionOrders', variables.orderId, 'bundles'] });
      }
    },
  });
}