import { useMutation, useQueryClient } from '@tanstack/react-query';
import { advanceBundleStage } from '@/mocks/handlers/productionBundle.mock';

export function useAdvanceBundleStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bundleId, nextStageOrder, nextStageName, isLastStage }) =>
      advanceBundleStage(bundleId, nextStageOrder, nextStageName, isLastStage),
    onSuccess: (updatedBundle) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', updatedBundle.orderId, 'bundles'] });
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allBundles'] });
    },
  });
} 