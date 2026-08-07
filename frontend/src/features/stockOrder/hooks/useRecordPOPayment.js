import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useRecordPOPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ poId, amount, type, remarks }) => {
      // Real backend API endpoint call karein
      const response = await api.post(`/purchase-orders/${poId}/payments`, { amount, type, remarks });
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders', variables.poId, 'payments'] });
    },
  });
}