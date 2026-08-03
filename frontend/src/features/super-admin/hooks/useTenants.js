import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useTenants — fetches all factories registered on the platform.
 */
export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const response = await api.get('/tenants');
      return response.tenants; // Backend wraps tenants in { success: true, tenants: [...] }
    },
  });
}