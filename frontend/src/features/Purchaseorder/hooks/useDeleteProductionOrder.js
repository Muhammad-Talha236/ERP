import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useDeleteProductionOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/production-orders/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
    },
  });
}