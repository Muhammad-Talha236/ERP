import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useUpdateProductionOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const response = await api.put(`/production-orders/${id}`, updatedData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
    },
  });
}