import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmployee } from '@/mocks/handlers/employee.mock';

/**
 * useDeleteEmployee — mutation hook for removing an employee.
 *
 * Per business rules (docs/04_Database_Design_Part2.md), employees
 * are soft-deleted on the backend (deleted_at is set, not a real
 * row deletion) — that logic lives server-side. This hook just
 * calls the delete endpoint and keeps the frontend cache in sync.
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}