import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function usePaymentHistory(wageId) {
  return useQuery({
    queryKey: ['wages', wageId, 'payments'],
    queryFn: async () => {
      const response = await api.get(`/wages/${wageId}/payments`);
      return response.history || response.data || response;
    },
    enabled: Boolean(wageId),
  });
}