import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeStatsCards } from './components/EmployeeStatsCards';
import { EmployeeFilters } from './components/EmployeeFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useEmployees } from './hooks/useEmployees';
import { useDeleteEmployee } from './hooks/useDeleteEmployee';
import { employeesMockData } from '@/mocks/data/employees.mock';

/**
 * EmployeesPage — the main "Employees" screen.
 *
 * Owns THREE pieces of UI state beyond filters:
 *  - formModal: { open, employee } — employee is null for "Add",
 *    populated for "Edit". A single modal instance handles both modes
 *    (see EmployeeFormModal's isEditMode logic).
 *  - deleteTarget: the employee pending deletion, or null. Its mere
 *    presence controls whether ConfirmDialog is open.
 */
export function EmployeesPage() {
  const [filters, setFilters] = useState({ search: '', department: 'all' });
  const [formModal, setFormModal] = useState({ open: false, employee: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: employees, isLoading, isError, refetch } = useEmployees(filters);
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const departmentOptions = useMemo(() => {
    const unique = new Set(employeesMockData.map((e) => e.department));
    return Array.from(unique).sort();
  }, []);

  const handleAddClick = () => setFormModal({ open: true, employee: null });
  const handleEditClick = (employee) => setFormModal({ open: true, employee });
  const handleViewClick = (employee) => {
    // Full navigation to EmployeeRecordPage (/employees/$employeeId)
    // will be wired once that route exists — next module of work.
    console.log('Navigate to employee record:', employee.id);
  };

  const handleConfirmDelete = () => {
    deleteEmployee(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <AppLayout title="Employees" subtitle="Manage your workforce">
      <div className="space-y-6">
        <EmployeeStatsCards employees={employees ?? []} />

        <EmployeeFilters
          filters={filters}
          onFilterChange={setFilters}
          departmentOptions={departmentOptions}
          onAddClick={handleAddClick}
        />

        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      {/* Add/Edit form modal — single instance, mode controlled by
          whether formModal.employee is set */}
      <EmployeeFormModal
        open={formModal.open}
        onOpenChange={(open) => setFormModal({ open, employee: open ? formModal.employee : null })}
        employee={formModal.employee}
      />

      {/* Delete confirmation — deleteTarget's presence IS the open state */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Employee?"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />
    </AppLayout>
  );
}