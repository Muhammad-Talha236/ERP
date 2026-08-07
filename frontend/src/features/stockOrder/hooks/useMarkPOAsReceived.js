import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * useMarkPOAsReceived — mutation hook for the "Mark as Received"
 * action inside PODetailModal.
 */
export function useMarkPOAsReceived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.patch(`/purchase-orders/${id}/receive`);
      return response.po || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] }); // Inventory stock update reflect karne ke liye
    },
  });
}