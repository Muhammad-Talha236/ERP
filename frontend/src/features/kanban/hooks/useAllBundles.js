import { useQuery } from '@tanstack/react-query';
import { fetchAllBundles } from '@/mocks/handlers/productionBundle.mock';

export function useAllBundles() {
  return useQuery({ queryKey: ['allBundles'], queryFn: fetchAllBundles });
}