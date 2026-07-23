import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveQualityCheck, rejectQualityCheck } from '@/mocks/handlers/productionOrder.mock';

/**
 * useQualityCheckAction — mutation hooks for the admin's Approve/
 * Reject decision on a Quality Check stage.
 */
export function useApproveQualityCheck() {
  return useMutation({ mutationFn: approveQualityCheck });
}

export function useRejectQualityCheck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectQualityCheck,
    onSuccess: (updatedStep) => {
      // Assignments were reset server-side — refresh that list so
      // the panel shows everyone as "not done" again immediately.
      queryClient.invalidateQueries({ queryKey: ['workflowSteps', updatedStep.id, 'assignments'] });
    },
  });
}