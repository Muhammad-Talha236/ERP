import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePurchaseOrder } from '@/mocks/handlers/purchaseOrder.mock';

/**
 * useUpdatePurchaseOrder — mutation hook for editing an existing
 * PO's supplier, items, or expected delivery date.
 */
export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updatePurchaseOrder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
}