import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePOPaymentTransaction } from '@/mocks/handlers/purchaseOrder.mock';

/**
 * useUpdatePOPayment — mutation hook for editing an existing PO
 * payment/advance transaction.
 */
export function useUpdatePOPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, ...updates }) => updatePOPaymentTransaction(transactionId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders', data.po.id, 'payments'] });
    },
  });
}