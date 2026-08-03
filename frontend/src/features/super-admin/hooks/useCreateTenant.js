import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useCreateTenant — mutation hook for Super Admin's "Create Factory"
 * form. Sends real API request to backend.
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // Real backend API call
      const response = await api.post('/tenants', data);
      return response;
    },
    onSuccess: (data) => {
      // Tenants list refresh karein
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      console.log('✅ Tenant created successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Create tenant error:', error);
      throw error;
    },
  });
}