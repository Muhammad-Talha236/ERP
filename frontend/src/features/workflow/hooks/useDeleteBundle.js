import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBundle } from '@/mocks/handlers/productionBundle.mock';

export function useDeleteBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBundle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allBundles'] });
    },
  });
}