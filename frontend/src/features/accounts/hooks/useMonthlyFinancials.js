import { useQuery } from '@tanstack/react-query';
import { fetchMonthlyFinancials } from '@/mocks/handlers/accounts.mock';

/**
 * useMonthlyFinancials — fetches pre-aggregated monthly revenue vs
 * expense data for the Accounts chart.
 */
export function useMonthlyFinancials() {
  return useQuery({
    queryKey: ['monthlyFinancials'],
    queryFn: fetchMonthlyFinancials,
  });
}