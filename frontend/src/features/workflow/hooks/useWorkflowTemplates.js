import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useWorkflowTemplates() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await api.get('/workflows');
      return response.data?.data || response.data || response || [];
    },
  });
}