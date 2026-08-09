import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useAdvances(filters = {}) {
  return useQuery({
    queryKey: ['advances', filters],
    queryFn: async () => {
      const response = await api.get('/advances', { params: filters });
      return response.advances || [];
    },
  });
}

export function useCreateAdvance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/advances', data);
      return response.advance || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advances'] });
    },
  });
}