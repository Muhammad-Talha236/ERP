import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTenant } from '@/mocks/handlers/tenant.mock';

/**
 * useCreateTenant — mutation hook for Super Admin's "Create Factory"
 * form.
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}   