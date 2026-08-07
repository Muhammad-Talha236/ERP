import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await api.get('/workflows'); // Backend endpoint se live workflows fetch honge
      return response.data || response;
    },
  });
}