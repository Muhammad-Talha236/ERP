import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useApproveWage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wageId) => {
      const response = await api.patch(`/wages/${wageId}/approve`);
      return response.wage || response;
    },
    onSuccess: (updatedWage) => {
      // Optimistically patch every cached ['wagesOverview', month, year]
      // query so the table updates instantly, without waiting for a refetch.
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

      queryClient.invalidateQueries({ queryKey: ['wages'] });
      queryClient.invalidateQueries({ queryKey: ['wagesOverview'] });
    },
  });
}