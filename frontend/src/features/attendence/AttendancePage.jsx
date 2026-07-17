import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttendanceStatsCards } from './components/AttendanceStatsCards';
import { AttendanceCalendar } from './components/AttendanceCalendar';
import { CheckInOutList } from './components/CheckInOutList';
import { LeaveRequestsTable } from './components/LeaveRequestsTable';
import { MarkAttendanceModal } from './components/MarkAttendanceModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useAttendance } from './hooks/useAttendance';
import { useLeaveRequests } from './hooks/useLeaveRequests';
import { format } from 'date-fns';

/**
 * AttendancePage — the main "Attendance" screen: stats row, monthly
 * calendar + today's check-in list side by side, and a leave
 * requests table below.
 *
 * Owns `currentMonth` (defaults to the real current month) and
 * `isMarkModalOpen`. All attendance data for the visible month is
 * fetched once via useAttendance({ month, year }) and then sliced
 * down to "today's records" in memory for the stats cards and
 * check-in list — avoiding a second, redundant network/mock call
 * just to get today's subset.
 */
export function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  const monthFilters = {
    month: currentMonth.getMonth() + 1, // JS months are 0-indexed
    year: currentMonth.getFullYear(),
  };

  const { data: monthRecords, isLoading, isError, refetch } = useAttendance(monthFilters);
  const { data: leaveRequests, isLoading: isLeaveLoading } = useLeaveRequests();

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todayRecords = useMemo(
    () => (monthRecords ?? []).filter((r) => r.attendanceDate === todayKey),
    [monthRecords, todayKey]
  );

  if (isError) {
    return (
      <AppLayout title="Attendance" subtitle="Track daily attendance and leave">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Attendance" subtitle="Track daily attendance and leave">
      <div className="space-y-6">
        <AttendanceStatsCards todayRecords={todayRecords} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AttendanceCalendar
              currentMonth={currentMonth}
              records={monthRecords ?? []}
            />
          </div>
          <div>
            <CheckInOutList records={todayRecords} isLoading={isLoading} />
          </div>
        </div>

        <LeaveRequestsTable
          requests={leaveRequests}
          isLoading={isLeaveLoading}
          onNewRequestClick={() => setIsMarkModalOpen(true)}
        />
      </div>

      <MarkAttendanceModal open={isMarkModalOpen} onOpenChange={setIsMarkModalOpen} />
    </AppLayout>
  );
}