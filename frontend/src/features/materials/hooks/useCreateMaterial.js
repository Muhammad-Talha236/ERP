import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMaterial) => {
      const response = await api.post('/materials', newMaterial);
      return response.material || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}