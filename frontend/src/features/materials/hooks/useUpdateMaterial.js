import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMaterial } from '@/mocks/handlers/material.mock';

/**
 * useUpdateMaterial — mutation hook for editing an existing material
 * (e.g. adjusting stock, updating price, changing status).
 */
export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateMaterial(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}