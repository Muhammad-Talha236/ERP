import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '@/services/api';

/**
 * useReplaceOrderWorkflowStructure — mutation hook for
 * workflow stages update in Express / Neon DB.
 */
export function useReplaceOrderWorkflowStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, stages }) => {
      // POST Request send ho rahi hai correct req.body structure ke sath
      const response = await post(`/workflows/stages/${orderId}`, { stages });
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders', variables.orderId, 'steps'] });
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}