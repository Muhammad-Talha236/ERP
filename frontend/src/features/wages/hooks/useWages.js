import { useQuery } from '@tanstack/react-query';
import { fetchWages } from '@/mocks/handlers/wage.mock';

/**
 * useWages — fetches wage/payroll records, optionally filtered by
 * employee or payment status.
 *
 * @param {{ employeeId?: string, status?: string }} filters
 */
export function useWages(filters = {}) {
  return useQuery({
    queryKey: ['wages', filters],
    queryFn: () => fetchWages(filters),
  });
}