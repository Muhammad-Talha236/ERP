import { useQuery } from '@tanstack/react-query';
import { fetchOrderMovements } from '@/mocks/handlers/productionBundle.mock';

/**
 * useOrderMovements — fetches every bundle movement log entry for
 * one order (across all its bundles), powering PO Flow Step 7's
 * "bundle movements" breakdown.
 * @param {string} orderId
 */
export function useOrderMovements(orderId) {
  return useQuery({
    queryKey: ['productionOrders', orderId, 'movements'],
    queryFn: () => fetchOrderMovements(orderId),
    enabled: Boolean(orderId),
  });
}