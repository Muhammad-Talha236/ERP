import { useQuery } from '@tanstack/react-query';
import { fetchPOPaymentHistory } from '@/mocks/handlers/purchaseOrder.mock';

/**
 * usePOPaymentHistory — fetches all payment/advance transactions
 * for one specific purchase order.
 *
 * @param {string} poId
 */
export function usePOPaymentHistory(poId) {
  return useQuery({
    queryKey: ['purchaseOrders', poId, 'payments'],
    queryFn: () => fetchPOPaymentHistory(poId),
    enabled: Boolean(poId),
  });
}