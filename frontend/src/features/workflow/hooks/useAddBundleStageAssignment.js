// src/features/workflow/hooks/useAddBundleStageAssignment.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBundleStageAssignment } from '@/mocks/handlers/productionBundle.mock';

export function useAddBundleStageAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bundleId, stepId, stageOrder, stageName, employeeId, employeeName }) =>
      addBundleStageAssignment(bundleId, stepId, stageOrder, stageName, employeeId, employeeName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bundles', variables.bundleId, 'assignments'] });
    },
  });
}