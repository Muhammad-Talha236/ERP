// frontend/src/features/workflow/hooks/useEmployees.js
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/employees');
      console.log("Employees API Response:", response);

      // Safe check: Ensure we always return an array
      if (Array.isArray(response)) {
        return response;
      }
      return response.employees || response.data || [];
    },
  });
}