import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/mocks/handlers/accounts.mock';

/**
 * useCreateTransaction — mutation hook for manually logging a new
 * income/expense transaction.
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}