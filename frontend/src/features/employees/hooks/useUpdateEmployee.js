import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployee } from '@/mocks/handlers/employee.mock';

/**
 * useUpdateEmployee — mutation hook for editing an employee record.
 *
 * Accepts { id, updates } as a single object (rather than two
 * separate arguments) because that's the shape React Query's
 * mutate() function expects when calling this hook from a component:
 *
 *   const { mutate } = useUpdateEmployee();
 *   mutate({ id: employee.id, updates: { status: 'Inactive' } });
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateEmployee(id, updates),
    onSuccess: (updatedEmployee) => {
      // Refresh the list (table view) ...
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      // ...and the specific employee's detail cache, so
      // EmployeeRecordPage shows fresh data immediately too.
      queryClient.invalidateQueries({
        queryKey: ['employees', updatedEmployee.id],
      });
    },
  });
}