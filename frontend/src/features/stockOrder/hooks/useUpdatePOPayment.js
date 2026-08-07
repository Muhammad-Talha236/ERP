import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useUpdatePOPayment — mutation hook for editing an existing PO
 * payment/advance transaction.
 */
export function useUpdatePOPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, ...updates }) => {
      // Note: Agar backend par transaction update ka route alag hai toh use adjust kar lein
      const response = await api.put(`/purchase-orders/payments/${transactionId}`, updates);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      if (data?.po?.id) {
        queryClient.invalidateQueries({ queryKey: ['purchaseOrders', data.po.id, 'payments'] });
      }
    },
  });
}