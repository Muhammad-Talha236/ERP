import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePaymentTransaction } from '@/mocks/handlers/wage.mock';

/**
 * useUpdatePayment — mutation hook for editing an existing payment
 * or advance transaction. Invalidates both the wages list (in case
 * amountPaid/status changed) and this wage's payment history.
 */
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, ...updates }) => updatePaymentTransaction(transactionId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
      queryClient.invalidateQueries({ queryKey: ['wages', data.wage.id, 'payments'] });
    },
  });
}