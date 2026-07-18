import { useQuery } from '@tanstack/react-query';
import { fetchMaterials } from '@/mocks/handlers/material.mock';

/**
 * useMaterials — fetches the list of raw materials, optionally
 * filtered by search text or low-stock flag.
 *
 * @param {{ search?: string, stock?: 'low' }} filters
 */
export function useMaterials(filters = {}) {
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: () => fetchMaterials(filters),
  });
}