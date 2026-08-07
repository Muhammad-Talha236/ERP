import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useProcessPayroll — mutation hook for processing bulk payroll.
 */
export function useProcessPayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payrollData) => {
      // Agar backend par bulk process ka route hai, ya aap loop/single request handle karte hain
      const response = await api.post('/wages', payrollData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wages'] });
    },
  });
}