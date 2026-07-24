import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replaceOrderWorkflowStructure } from '@/mocks/handlers/productionOrder.mock';

/**
 * useReplaceOrderWorkflowStructure — mutation hook for
 * add/remove/rename/reposition of an order's stages, used only
 * before the order has started.
 */
export function useReplaceOrderWorkflowStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, steps }) => replaceOrderWorkflowStructure(orderId, steps),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', variables.orderId, 'steps'] });
    },
  });
}