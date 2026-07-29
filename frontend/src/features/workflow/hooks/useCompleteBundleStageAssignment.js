import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeBundleStageAssignment } from '@/mocks/handlers/productionBundle.mock';

/**
 * useCompleteBundleStageAssignment — marks one employee's portion of
 * a bundle's stage as done.
 *
 * FIX: now also invalidates ['bundles', bundleId, 'assignments'] —
 * previously only ['wages'] was invalidated, so clicking "Mark done"
 * succeeded on the server but the UI never re-fetched to show it.
 */
export function useCompleteBundleStageAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, wagePerPerson }) => completeBundleStageAssignment(assignmentId, wagePerPerson),
    onSuccess: (updatedAssignment) => {
      queryClient.invalidateQueries({ queryKey: ['bundles', updatedAssignment.bundleId, 'assignments'] });
      queryClient.invalidateQueries({ queryKey: ['wages'] });
    },
  });
}