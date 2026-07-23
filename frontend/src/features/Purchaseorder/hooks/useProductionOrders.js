import { useQuery } from '@tanstack/react-query';
import { fetchProductionOrders } from '@/mocks/handlers/productionOrder.mock';

/**
 * useProductionOrders — fetches customer production orders,
 * optionally filtered by status, customer, or search text.
 * Powers both the Kanban board and any list view.
 *
 * @param {{ status?: string, search?: string, customerId?: string }} filters
 */
export function useProductionOrders(filters = {}) {
  return useQuery({
    queryKey: ['productionOrders', filters],
    queryFn: () => fetchProductionOrders(filters),
  });
}