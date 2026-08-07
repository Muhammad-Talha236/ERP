import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/employees');

      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.data)) return response.data;
      if (Array.isArray(response?.employees)) return response.employees;
      if (Array.isArray(response?.data?.data)) return response.data.data;

      console.error('Unexpected /employees response shape:', response);
      throw new Error('Employee data format was not recognized — check the backend response.');
    },
    retry: 1,
  });
}