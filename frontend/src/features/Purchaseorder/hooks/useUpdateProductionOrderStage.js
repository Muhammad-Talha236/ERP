import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProductionOrderStage } from '@/mocks/handlers/productionOrder.mock';

/**
 * useUpdateProductionOrderStage — mutation hook for moving an
 * order's overall stage forward, e.g. when a Kanban card is
 * dragged to a new column.
 */
export function useUpdateProductionOrderStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStageOrder, status }) =>
      updateProductionOrderStage(id, { currentStageOrder, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
    },
  });
}