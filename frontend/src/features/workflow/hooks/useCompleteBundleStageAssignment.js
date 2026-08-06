// frontend/src/features/workflow/hooks/useCompleteBundleStageAssignment.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function useCompleteBundleStageAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, wagePerPerson }) => {
      console.log('[useCompleteBundleStageAssignment] calling PATCH for assignmentId', assignmentId, 'wagePerPerson', wagePerPerson);
      const response = await api.patch(`/workflows/bundles/assignments/${assignmentId}/complete`, { wagePerPerson });
      console.log('[useCompleteBundleStageAssignment] PATCH response body', response);
      return response.data;
    },
    onMutate: (variables) => {
      console.log('[useCompleteBundleStageAssignment] onMutate', variables);
    },
    onSuccess: (updatedAssignment, variables) => {
      console.log('[useCompleteBundleStageAssignment] onSuccess', { updatedAssignment, variables });
      const updated = updatedAssignment || {};
      const dbBundleId = String(updated.bundle_id ?? updated.bundleId ?? variables?.bundleId ?? '');

      try {
        const queries = queryClient.getQueriesData({
          predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === 'bundle-assignments',
        });

        for (const [qKey] of queries) {
          queryClient.setQueryData(qKey, (old = []) => {
            return old.map((a) => (String(a.id || a.ID) === String(updated.id || updated.ID) ? { ...a, status: 'Completed', isDone: true } : a));
          });
        }
      } catch (e) {
        console.warn('[useCompleteBundleStageAssignment] cache update failed', e);
      }

      if (dbBundleId) {
        queryClient.invalidateQueries({ queryKey: ['bundle-assignments', dbBundleId] });
      }
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'bundle-assignments',
      });
    },
    onError: (error, variables) => {
      console.error('[useCompleteBundleStageAssignment] onError', { error, variables });
    },
    onSettled: (data, error, variables) => {
      console.log('[useCompleteBundleStageAssignment] onSettled', { data, error, variables });
    },
  });
}