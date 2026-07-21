import { useQuery } from '@tanstack/react-query';
import { fetchBundlesByOrder } from '@/mocks/handlers/productionBundle.mock';

/**
 * useBundlesByOrder — fetches all bundles belonging to one order.
 * @param {string} orderId
 */
export function useBundlesByOrder(orderId) {
  return useQuery({
    queryKey: ['productionOrders', orderId, 'bundles'],
    queryFn: () => fetchBundlesByOrder(orderId),
    enabled: Boolean(orderId),
  });
}