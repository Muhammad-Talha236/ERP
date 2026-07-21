import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/mocks/handlers/accounts.mock';

/**
 * useTransactions — fetches recent financial transactions,
 * optionally filtered by type (Income/Expense).
 * @param {{ type?: string }} filters
 */
export function useTransactions(filters = {}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
  });
}