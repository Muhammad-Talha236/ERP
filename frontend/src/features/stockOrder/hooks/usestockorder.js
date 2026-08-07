import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export function usePurchaseOrders(filters = {}) {
  return useQuery({
    queryKey: ['purchaseOrders', filters],
    queryFn: async () => {
      const response = await api.get('/purchase-orders', { params: filters });
      return response.purchaseOrders || response.data || response;
    },
  });
}