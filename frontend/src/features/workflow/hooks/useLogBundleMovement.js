import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logBundleMovement } from '@/mocks/handlers/productionBundle.mock';

/**
 * useLogBundleMovement — mutation hook for PO Flow Step 5: an
 * employee logs how many units they received and output at a stage.
 */
export function useLogBundleMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bundleId, ...movementData }) => logBundleMovement(bundleId, movementData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', data.bundle.orderId, 'bundles'] });
      queryClient.invalidateQueries({ queryKey: ['productionOrders', data.bundle.orderId, 'movements'] });
    },
  });
}