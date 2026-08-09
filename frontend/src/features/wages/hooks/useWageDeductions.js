import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useWageDeductions(wageId) {
  return useQuery({
    queryKey: ['wages', wageId, 'deductions'],
    queryFn: async () => {
      const response = await api.get(`/wages/${wageId}/deductions`);
      return response.deductions || [];
    },
    enabled: Boolean(wageId),
  });
}