// src/features/workflow/hooks/useBundleStageAssignments.js
import { useQuery } from '@tanstack/react-query';
import { fetchBundleStageAssignments } from '@/mocks/handlers/productionBundle.mock';

export function useBundleStageAssignments(bundleId) {
  return useQuery({
    queryKey: ['bundles', bundleId, 'assignments'],
    queryFn: () => fetchBundleStageAssignments(bundleId),
    enabled: Boolean(bundleId),
  });
}