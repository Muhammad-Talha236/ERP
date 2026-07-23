import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPurchaseOrder } from '@/mocks/handlers/purchaseOrder.mock';

/**
 * useCreatePurchaseOrder — mutation hook for the "New PO" form.
 */
export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
}