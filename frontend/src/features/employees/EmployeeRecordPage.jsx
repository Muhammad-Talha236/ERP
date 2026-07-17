import { useParams } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeRecordHeader } from './components/EmployeeRecordHeader';
import { EmployeeInfoCard } from './components/EmployeeInfoCard';
import { EmployeeWorkHistoryList } from './components/EmployeeWorkHistoryList';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { useEmployee } from './hooks/useEmployee';
import { useEmployeeWorkHistory } from './hooks/useEmployeeWorkHistory';

/**
 * EmployeeRecordPage — individual employee detail page.
 *
 * FIX: useParams now uses { strict: false } instead of a "from"
 * path string. Strict matching by path string relies on TanStack
 * Router's generated route-tree TYPES to resolve correctly — since
 * we're intentionally JS-only (no TypeScript route registration),
 * that strict lookup was unreliable and returned undefined params.
 * { strict: false } instead grabs whatever params exist from
 * wherever the router currently is, which works correctly regardless
 * of type registration.
 */
export function EmployeeRecordPage() {
  const { employeeId } = useParams({ strict: false });

  const { data: employee, isLoading, isError, refetch } = useEmployee(employeeId);
  const { data: workHistory, isLoading: isHistoryLoading } = useEmployeeWorkHistory(employeeId);

  if (isLoading) {
    return (
      <AppLayout title="Employee Record" subtitle="Loading employee details...">
        <LoadingSkeleton rows={4} />
      </AppLayout>
    );
  }

  if (isError || !employee) {
    return (
      <AppLayout title="Employee Record" subtitle="Unable to load employee">
        <ErrorState
          message="This employee could not be found or failed to load."
          onRetry={refetch}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Employee Record"
      subtitle={`${employee.firstName} ${employee.lastName}'s profile and history`}
    >
      <div className="space-y-6">
        <EmployeeRecordHeader employee={employee} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmployeeInfoCard employee={employee} />
          <EmployeeWorkHistoryList entries={workHistory} isLoading={isHistoryLoading} />
        </div>
      </div>
    </AppLayout>
  );
}