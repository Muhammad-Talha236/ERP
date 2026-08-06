import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useOrderMovements — fetches every bundle movement log entry for
 * one order (across all its bundles), powering PO Flow Step 7's
 * "bundle movements" breakdown.
 * @param {string} orderId
 */
export function useOrderMovements(orderId) {
  return useQuery({
    queryKey: ['productionOrders', orderId, 'movements'],
    queryFn: async () => {
      const response = await api.get(`/workflows/logs/${orderId}`);
      return response.data;
    },
    enabled: Boolean(orderId),
  });
}