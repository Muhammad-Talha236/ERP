import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDailyUsageEntry } from '@/mocks/handlers/dailyUsage.mock';

/**
 * useCreateUsageEntry — mutation hook for recording a new daily
 * material usage entry (assigning consumables to an employee).
 */
export function useCreateUsageEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDailyUsageEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyUsage'] });
      // Recording usage also reduces material stock per business
      // rules — invalidate materials too so MaterialsPage (if open
      // in another tab/view) reflects the updated stock.
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}