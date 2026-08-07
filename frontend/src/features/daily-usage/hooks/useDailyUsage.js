import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDailyUsage, createDailyUsage } from '../api/dailyUsageApi';

export function useDailyUsage() {
  return useQuery({
    queryKey: ['dailyUsage'],
    queryFn: fetchDailyUsage,
  });
}

export function useCreateDailyUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDailyUsage,
    onSuccess: () => {
      // Usage list aur Materials stock dono ko invalidate karein taaki stock update reflect ho
      queryClient.invalidateQueries({ queryKey: ['dailyUsage'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}