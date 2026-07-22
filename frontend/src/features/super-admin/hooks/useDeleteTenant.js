import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTenant } from '@/mocks/handlers/tenant.mock';

/**
 * useDeleteTenant — mutation hook for permanently removing a factory.
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}