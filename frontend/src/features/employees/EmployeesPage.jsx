import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeStatsCards } from './components/EmployeeStatsCards';
import { EmployeeFilters } from './components/EmployeeFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useEmployees } from './hooks/useEmployees';
import { useDeleteEmployee } from './hooks/useDeleteEmployee';

/**
 * EmployeesPage — the main "Employees" screen.
 *
 * FIX: departmentOptions now comes from the REAL employees list
 * (fetched from the backend), not from the old mock data file.
 * A second, always-unfiltered useEmployees() call powers just the
 * dropdown options, so filtering by department doesn't shrink the
 * dropdown's own choices (React Query caches this separately from
 * the filtered list, so it's not an extra real cost after the first load).
 */
export function EmployeesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', department: 'all' });
  const [formModal, setFormModal] = useState({ open: false, employee: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: employees, isLoading, isError, refetch } = useEmployees(filters);
  const { data: allEmployees } = useEmployees(); // unfiltered — only used for building the dropdown
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const departmentOptions = useMemo(() => {
    const unique = new Set((allEmployees ?? []).map((e) => e.department).filter(Boolean));
    return Array.from(unique).sort();
  }, [allEmployees]);

  const handleAddClick = () => setFormModal({ open: true, employee: null });
  const handleEditClick = (employee) => setFormModal({ open: true, employee });

  // Now navigates to the real Employee Record page instead of logging.
  const handleViewClick = (employee) => {
    navigate({ to: '/employees/$employeeId', params: { employeeId: employee.id } });
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

      <EmployeeFormModal
        open={formModal.open}
        onOpenChange={(open) => setFormModal({ open, employee: open ? formModal.employee : null })}
        employee={formModal.employee}
      />

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