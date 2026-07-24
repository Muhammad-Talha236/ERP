import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeStageAssignment } from '@/mocks/handlers/productionOrder.mock';

/**
 * useCompleteStageAssignment — one employee marks their own portion
 * of a step as done. Also invalidates ['wages'] since completing
 * work credits the employee's wage record server-side.
 */
export function useCompleteStageAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeStageAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
    },
  });
}