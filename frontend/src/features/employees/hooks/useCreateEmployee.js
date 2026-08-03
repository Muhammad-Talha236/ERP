import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useCreateEmployee — mutation hook for the "Add Employee" form.
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEmployee) => {
      const response = await api.post('/employees', newEmployee);
      return response.employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}