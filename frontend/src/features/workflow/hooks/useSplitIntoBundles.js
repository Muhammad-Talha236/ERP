import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBundleFromSource } from '@/mocks/handlers/productionBundle.mock';

/**
 * useSplitIntoBundles — name kept for import continuity; now creates
 * a new bundle by carving quantity out of an existing one, rather
 * than dividing the whole order into N equal bundles.
 */
export function useSplitIntoBundles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, sourceBundleId, quantity, firstStageName }) =>
      createBundleFromSource(orderId, sourceBundleId, quantity, firstStageName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', variables.orderId, 'bundles'] });
      queryClient.invalidateQueries({ queryKey: ['allBundles'] });
    },
  });
}