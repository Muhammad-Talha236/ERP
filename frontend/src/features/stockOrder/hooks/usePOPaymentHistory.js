import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * usePOPaymentHistory — fetches all payment/advance transactions
 * for one specific purchase order from the real backend.
 *
 * @param {string} poId
 */
export function usePOPaymentHistory(poId) {
  return useQuery({
    queryKey: ['purchaseOrders', poId, 'payments'],
    queryFn: async () => {
      const response = await api.get(`/purchase-orders/${poId}/payments`);
      return response.history || response.data || response;
    },
    enabled: Boolean(poId),
  });
}