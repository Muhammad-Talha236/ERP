import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await api.put(`/materials/${id}`, updates);
      return response.material || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}