import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logBundleMovement } from '@/mocks/handlers/productionBundle.mock';

export function useLogBundleMovement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bundleId, ...movementData }) => logBundleMovement(bundleId, movementData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', data.bundle.orderId, 'bundles'] });
      queryClient.invalidateQueries({ queryKey: ['productionOrders', data.bundle.orderId, 'movements'] });
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allBundles'] });
    },
  });
}