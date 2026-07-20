import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordWagePayment } from '@/mocks/handlers/wage.mock';

/**
 * useRecordPayment — mutation hook for recording a payment or
 * advance against ONE wage record. Used by PayWageModal.
 *
 * On success, invalidates:
 *  - ['wages'] so the payroll table reflects the new amountPaid/status
 *  - ['wages', wageId, 'payments'] so the modal's own history list
 *    updates immediately without needing to close/reopen the modal
 */
export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wageId, amount, type, remarks }) =>
      recordWagePayment(wageId, { amount, type, remarks }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
      queryClient.invalidateQueries({ queryKey: ['wages', variables.wageId, 'payments'] });
    },
  });
}