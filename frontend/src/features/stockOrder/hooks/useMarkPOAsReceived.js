import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markPOAsReceived } from '@/mocks/handlers/purchaseOrder.mock';

/**
 * useMarkPOAsReceived — mutation hook for the "Mark as Received"
 * action inside PODetailModal.
 */
export function useMarkPOAsReceived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPOAsReceived,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
    },
  });
}