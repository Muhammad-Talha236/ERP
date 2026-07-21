import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStageAssignment } from '@/mocks/handlers/productionOrder.mock';

/**
 * useAddStageAssignment — mutation hook for assigning an additional
 * employee to a step (when headcount > 1 needs multiple people).
 */
export function useAddStageAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, employeeId, employeeName }) => addStageAssignment(stepId, { employeeId, employeeName }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflowSteps', variables.stepId, 'assignments'] });
    },
  });
}