import { useMutation, useQueryClient } from '@tanstack/react-query';

const logBundleMovementApi = async (movementData) => {
  const { bundleId, ...payload } = movementData;
  
  // LocalStorage se token retrieve kar rahe hain (apni app ki key ke mutabiq check kar lein e.g., 'token' ya 'authToken')
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');

  const response = await fetch(`/api/workflows/bundles/${bundleId}/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to log bundle movement');
  }
  return data.data;
};

export const useLogBundleMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logBundleMovementApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-bundles'] });
      queryClient.invalidateQueries({ queryKey: ['movement-logs'] });
    },
  });
};