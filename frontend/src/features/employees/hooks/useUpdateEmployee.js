import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useUpdateEmployee — mutation hook for editing an employee record.
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await api.put(`/employees/${id}`, updates);
      return response.employee;
    },
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      if (updatedEmployee && updatedEmployee.id) {
        queryClient.invalidateQueries({
          queryKey: ['employees', updatedEmployee.id],
        });
      }
    },
  });
}