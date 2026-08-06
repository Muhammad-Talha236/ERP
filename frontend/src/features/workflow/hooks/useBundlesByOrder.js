import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useBundlesByOrder — fetches all bundles belonging to one order.
 * @param {string} orderId
 */
export function useBundlesByOrder(orderId) {
  return useQuery({
    queryKey: ['productionOrders', orderId, 'bundles'],
    queryFn: async () => {
      const response = await api.get('/workflows/bundles', { params: { poNumber: orderId } });
      return response.data;
    },
    enabled: Boolean(orderId),
  });
}