import { useQuery } from '@tanstack/react-query';

export function useBundleStageAssignments(bundleId) {
  return useQuery({
    queryKey: ['bundle-assignments', bundleId],
    queryFn: async () => {
      if (!bundleId) return [];
      const response = await fetch(`/api/workflows/bundles/${bundleId}/assignments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch bundle assignments');
      }
      return data.data;
    },
    enabled: !!bundleId,
  });
}