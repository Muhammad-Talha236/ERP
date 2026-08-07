import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPO) => {
      const response = await api.post('/purchase-orders', newPO);
      return response.po || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
}