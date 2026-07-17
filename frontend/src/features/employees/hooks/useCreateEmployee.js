import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee } from '@/mocks/handlers/employee.mock';

/**
 * useCreateEmployee — mutation hook for the "Add Employee" form.
 *
 * After a successful create, we invalidate the ['employees'] query
 * key — this tells React Query "the cached employee list is now
 * stale," triggering an automatic background refetch. This is how
 * the table updates itself the moment a new employee is added,
 * without us manually pushing the new record into local state.
 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      // Invalidates ALL queries starting with 'employees' — this
      // covers useEmployees() regardless of what filters were active,
      // since queryKey: ['employees', filters] all share this prefix.
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}