import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTenant } from '@/mocks/handlers/tenant.mock';

/**
 * useUpdateTenant — mutation hook for editing a factory's basic info.
 */
export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateTenant(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}