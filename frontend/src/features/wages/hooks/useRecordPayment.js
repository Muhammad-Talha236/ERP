import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wageId, amount, type, remarks, paymentMethod, paymentReference }) => {
      const response = await api.post(`/wages/${wageId}/payments`, { amount, type, remarks, paymentMethod, paymentReference });
      return response;
    },
    onSuccess: (data, variables) => {
      const updatedWage = data?.wage;

      if (updatedWage) {
        queryClient.setQueriesData({ queryKey: ['wagesOverview'] }, (old) => {
          if (!old) return old;
          return old.map((row) =>
            row.wageId === updatedWage.id
              ? {
                  ...row,
                  status: updatedWage.status,
                  paymentStatus: updatedWage.paymentStatus,
                  netAmount: updatedWage.netAmount,
                  amountPaid: updatedWage.amountPaid,
                }
              : row
          );
        });
      }

      queryClient.invalidateQueries({ queryKey: ['wages'] });
      queryClient.invalidateQueries({ queryKey: ['wagesOverview'] });
      queryClient.invalidateQueries({ queryKey: ['wages', variables.wageId, 'payments'] });
    },
  });
}