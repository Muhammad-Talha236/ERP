import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function useAddBundleStageAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAssignment) => {
      const response = await api.post(`/workflows/bundles/${newAssignment.bundleId}/assign`, newAssignment);
      // api.post returns the full response object { success, message, data }
      // return the created assignment object (data) to consumers
      return response.data;
    },
    onSuccess: (createdAssignment, variables) => {
      const created = createdAssignment || {};
      const uiBundleId = String(variables?.bundleId ?? '');
      const dbBundleId = String(created.bundle_id ?? created.bundleId ?? '');

      // Optimistically update cache for the most-likely query keys so UI updates instantly
      try {
        if (uiBundleId) {
          queryClient.setQueryData(['bundle-assignments', uiBundleId], (old = []) => {
            // avoid duplicating
            const exists = old.some((a) => String(a.id || a.ID) === String(created.id || created.ID));
            return exists ? old : [...old, created];
          });
        }

        if (dbBundleId && dbBundleId !== uiBundleId) {
          queryClient.setQueryData(['bundle-assignments', dbBundleId], (old = []) => {
            const exists = old.some((a) => String(a.id || a.ID) === String(created.id || created.ID));
            return exists ? old : [...old, created];
          });
        }
      } catch (e) {
        // ignore cache set errors
      }

      // Ensure queries are refetched as a fallback
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === 'bundle-assignments',
      });
    },
  });
}