import { useQuery } from '@tanstack/react-query';
import { fetchPaymentHistory } from '@/mocks/handlers/wage.mock';

/**
 * usePaymentHistory — fetches all payment/advance transactions for
 * one specific wage record, powering the history list inside
 * PayWageModal.
 *
 * @param {string} wageId
 */
export function usePaymentHistory(wageId) {
  return useQuery({
    queryKey: ['wages', wageId, 'payments'],
    queryFn: () => fetchPaymentHistory(wageId),
    enabled: Boolean(wageId),
  });
}