import { useMutation, useQueryClient } from '@tanstack/react-query';
import { splitOrderIntoBundles } from '@/mocks/handlers/productionBundle.mock';

/**
 * useSplitIntoBundles — mutation hook for dividing an order's total
 * quantity into multiple bundles.
 */
export function useSplitIntoBundles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, totalQuantity, quantityPerBundle, firstStageName }) =>
      splitOrderIntoBundles(orderId, totalQuantity, quantityPerBundle, firstStageName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', variables.orderId, 'bundles'] });
    },
  });
}