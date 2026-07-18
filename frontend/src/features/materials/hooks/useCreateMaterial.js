import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMaterial } from '@/mocks/handlers/material.mock';

/**
 * useCreateMaterial — mutation hook for the "Add Material" form.
 */
export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}   