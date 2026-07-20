import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordPOPayment } from '@/mocks/handlers/purchaseOrder.mock';

/**
 * useRecordPOPayment — mutation hook for recording a payment or
 * advance against a purchase order.
 */
export function useRecordPOPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ poId, amount, type, remarks }) => recordPOPayment(poId, { amount, type, remarks }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders', variables.poId, 'payments'] });
    },
  });
}