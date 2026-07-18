import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processPendingPayroll } from '@/mocks/handlers/wage.mock';

/**
 * useProcessPayroll — mutation hook for the "Process pending" bulk
 * action, which marks all Pending/Processing wage records as Paid.
 */
export function useProcessPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processPendingPayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
    },
  });
}