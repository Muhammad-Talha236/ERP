import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTenantStatus } from '@/mocks/handlers/tenant.mock';

/**
 * useUpdateTenantStatus — mutation hook for activating/suspending
 * a factory account.
 */
export function useUpdateTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateTenantStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}