import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductionOrder } from '@/mocks/handlers/productionOrder.mock';

/**
 * useCreateProductionOrder — mutation hook for the "New Order" form
 * (PO Flow Steps 1-3: submit requirement, generate PO number,
 * attach workflow steps — all handled inside the mock handler).
 */
export function useCreateProductionOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductionOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionOrders'] });
    },
  });
}