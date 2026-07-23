import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeStageAssignment } from '@/mocks/handlers/productionOrder.mock';

/**
 * useCompleteStageAssignment — mutation hook for one employee
 * marking their own portion of a step as done.
 */
export function useCompleteStageAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeStageAssignment,
  });
}