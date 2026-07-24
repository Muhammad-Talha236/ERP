import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBundle } from '@/mocks/handlers/productionBundle.mock';

export function useDeleteBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBundle,
    onSuccess: (_data, bundleId, context) => {
      // orderId isn't returned by delete, so the caller passes it
      // through as part of the mutate() call's context if needed —
      // simpler here: just invalidate all bundle queries broadly.
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
    },
  });
}