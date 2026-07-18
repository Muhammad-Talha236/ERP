import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markWageAsPaid } from '@/mocks/handlers/wage.mock';

/**
 * useMarkWageAsPaid — mutation hook for paying ONE specific
 * employee's wage record. This is the per-row action, distinct
 * from useProcessPayroll (bulk action).
 */
export function useMarkWageAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markWageAsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
    },
  });
}