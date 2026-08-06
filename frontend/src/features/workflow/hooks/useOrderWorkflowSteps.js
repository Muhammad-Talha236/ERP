import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useOrderWorkflowSteps — fetches ONE order's own editable workflow
 * steps (prices, expenses, assigned employees per stage).
 *
 * @param {string} orderId
 */
export function useOrderWorkflowSteps(orderId) {
  return useQuery({
    queryKey: ['productionOrders', orderId, 'steps'],
    queryFn: async () => {
      const response = await api.get(`/workflows/stages/${orderId}`);
      return response.data;
    },
    enabled: Boolean(orderId),
  });
}