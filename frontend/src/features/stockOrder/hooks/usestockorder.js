import { useQuery } from '@tanstack/react-query';
import { fetchPurchaseOrders } from '@/mocks/handlers/purchaseOrder.mock';

/**
 * usePurchaseOrders — fetches purchase orders, optionally filtered
 * by status or search text.
 *
 * @param {{ status?: string, search?: string }} filters
 */
export function usePurchaseOrders(filters = {}) {
  return useQuery({
    queryKey: ['purchaseOrders', filters],
    queryFn: () => fetchPurchaseOrders(filters),
  });
}