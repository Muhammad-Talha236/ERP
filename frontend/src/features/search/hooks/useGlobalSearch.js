import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useGlobalSearch — searches Employees, Materials, Production Orders,
 * and Purchase/Stock Orders in parallel, reusing each module's
 * existing ?search= query param support (already implemented on the
 * backend for all four). Only fires once the query is at least 2
 * characters, and each failed sub-request is swallowed (Promise.
 * allSettled) so one module's error doesn't kill the whole search.
 *
 * @param {string} query
 */
export function useGlobalSearch(query) {
  const trimmed = (query ?? '').trim();

  return useQuery({
    queryKey: ['globalSearch', trimmed],
    queryFn: async () => {
      const [employeesRes, materialsRes, ordersRes, stockRes] = await Promise.allSettled([
        api.get('/employees', { params: { search: trimmed } }),
        api.get('/materials', { params: { search: trimmed } }),
        api.get('/production-orders', { params: { search: trimmed } }),
        api.get('/purchase-orders', { params: { search: trimmed } }),
      ]);

      const pick = (result, ...keys) => {
        if (result.status !== 'fulfilled') return [];
        const body = result.value;
        for (const key of keys) {
          if (Array.isArray(body?.[key])) return body[key];
        }
        return Array.isArray(body) ? body : [];
      };

      return {
        employees: pick(employeesRes, 'employees', 'data').slice(0, 5),
        materials: pick(materialsRes, 'materials', 'data').slice(0, 5),
        orders: pick(ordersRes, 'data').slice(0, 5),
        stockOrders: pick(stockRes, 'purchaseOrders', 'data').slice(0, 5),
      };
    },
    enabled: trimmed.length >= 2,
    staleTime: 30 * 1000,
  });
}