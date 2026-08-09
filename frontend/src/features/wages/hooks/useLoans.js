import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useLoans(filters = {}) {
  return useQuery({
    queryKey: ['loans', filters],
    queryFn: async () => {
      const response = await api.get('/loans', { params: filters });
      return response.loans || [];
    },
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/loans', data);
      return response.loan || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
}