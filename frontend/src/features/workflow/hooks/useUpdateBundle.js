import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBundle } from '@/mocks/handlers/productionBundle.mock';

export function useUpdateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bundleId, updates }) => updateBundle(bundleId, updates),
    onSuccess: (updatedBundle) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', updatedBundle.orderId, 'bundles'] });
    },
  });
}