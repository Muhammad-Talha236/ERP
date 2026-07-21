import { useQuery } from '@tanstack/react-query';
import { fetchStageAssignments } from '@/mocks/handlers/productionOrder.mock';

/**
 * useStageAssignments — fetches every individual employee assigned
 * to one workflow step.
 * @param {string} stepId
 */
export function useStageAssignments(stepId) {
  return useQuery({
    queryKey: ['workflowSteps', stepId, 'assignments'],
    queryFn: () => fetchStageAssignments(stepId),
    enabled: Boolean(stepId),
  });
}