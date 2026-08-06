import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdvanceBundleStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bundleId, nextStageName, nextStageOrder, isLastStage }) => {
      const response = await fetch(`/api/workflows/bundles/advance-stage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bundleId, nextStageName, nextStageOrder, isLastStage })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to advance bundle stage');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}