import { useQuery } from '@tanstack/react-query';
import { fetchTenants } from '@/mocks/handlers/tenant.mock';

/**
 * useTenants — fetches all factories registered on the platform.
 */
export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
  });
}