import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useMaterials — fetches the list of raw materials, optionally
 * filtered by search text or low-stock flag from the real backend.
 *
 * @param {{ search?: string, stock?: 'low' }} filters
 */
export function useMaterials(filters = {}) {
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: async () => {
      const response = await api.get('/materials', { params: filters });
      return response.materials || response.data || response;
    },
  });
}