// src/features/workflow/hooks/useBulkAssignBundleStage.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkAssignBundleStage } from '@/mocks/handlers/productionBundle.mock';

export function useBulkAssignBundleStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bundleId, stepId, stageOrder, stageName, employees }) =>
      bulkAssignBundleStage(bundleId, stepId, stageOrder, stageName, employees),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bundles', variables.bundleId, 'assignments'] });
    },
  });
}