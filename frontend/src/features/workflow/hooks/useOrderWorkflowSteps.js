import { useQuery } from '@tanstack/react-query';
import { fetchOrderWorkflowSteps } from '@/mocks/handlers/productionOrder.mock';

/**
 * useOrderWorkflowSteps — fetches ONE order's own editable workflow
 * steps (prices, expenses, assigned employees per stage).
 *
 * @param {string} orderId
 */
export function useOrderWorkflowSteps(orderId) {
  return useQuery({
    queryKey: ['productionOrders', orderId, 'steps'],
    queryFn: () => fetchOrderWorkflowSteps(orderId),
    enabled: Boolean(orderId),
  });
}