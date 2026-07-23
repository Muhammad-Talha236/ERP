import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderWorkflowStep } from '@/mocks/handlers/productionOrder.mock';

/**
 * useUpdateOrderWorkflowStep — mutation hook for editing a single
 * step's price/expense/employee/wage, scoped to ONE order
 * (PO Flow Step 4).
 */
export function useUpdateOrderWorkflowStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, updates }) => updateOrderWorkflowStep(stepId, updates),
    onSuccess: (_data, variables) => {
      // We don't know the orderId directly here, so invalidate all
      // "steps" queries broadly — acceptable for our mock scale.
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
    },
  });
}