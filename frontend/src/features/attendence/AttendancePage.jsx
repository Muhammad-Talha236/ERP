import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AttendanceStatsCards } from './components/AttendanceStatsCards';
import { AttendanceCalendar } from './components/AttendanceCalendar';
import { CheckInOutList } from './components/CheckInOutList';
import { LeaveRequestsTable } from './components/LeaveRequestsTable';
import { MarkAttendanceModal } from './components/MarkAttendanceModal';
import { LeaveRequestModal } from './components/LeaveRequestModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useAttendance } from './hooks/useAttendance';
import { useLeaveRequests } from './hooks/useLeaveRequests';
import { useUpdateLeaveRequest } from './hooks/useUpdateLeaveRequest';
import { format, addDays, subDays } from 'date-fns';
import { toLocalDateString } from './utils/dateHelpers';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react';
import { useDeleteLeaveRequest } from './hooks/useDeleteLeaveRequest';
export function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [editAttendanceData, setEditAttendanceData] = useState(null);
  const [deleteLeaveId, setDeleteLeaveId] = useState(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [editLeaveData, setEditLeaveData] = useState(null);
const { mutate: deleteLeaveRequest } = useDeleteLeaveRequest();
  


const monthFilters = {
    month: currentMonth.getMonth() + 1,
    year: currentMonth.getFullYear(),
  };

  const { data: monthRecords, isLoading, isError, refetch } = useAttendance(monthFilters);
  const { data: leaveRequests, isLoading: isLeaveLoading } = useLeaveRequests();
  const { mutate: updateLeaveRequest } = useUpdateLeaveRequest();

  const selectedDateKey = toLocalDateString(selectedDate);
  const selectedDateRecords = useMemo(
    () => (monthRecords ?? []).filter((r) => r.attendanceDate === selectedDateKey),
    [monthRecords, selectedDateKey]
  );

  const handleMonthChange = (nextMonth) => {
    setCurrentMonth(nextMonth);
    setSelectedDate(nextMonth);
  };

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
        
        {/* STATS CARDS */}
        <div>
          <AttendanceStatsCards todayRecords={selectedDateRecords} />
        </div>

        {/* MOBILE ONLY: Date Selection Bar */}
        <div className="block lg:hidden rounded-card border border-border bg-background p-4 flex flex-col gap-3">
          
          {/* Row 1: Date Navigation & Picker */}
          <div className="flex items-center justify-between gap-2 w-full">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 shrink-0"
              onClick={() => setSelectedDate((d) => subDays(d, 1))}
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white/5 flex-1 min-w-0">
              <CalendarDays size={16} className="text-primary shrink-0" />
              <input
                type="date"
                value={selectedDateKey}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(new Date(e.target.value));
                    setCurrentMonth(new Date(e.target.value));
                  }
                }}
                className="bg-transparent text-xs sm:text-sm font-semibold text-text-primary cursor-pointer focus:outline-none w-full text-center"
              />
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 shrink-0"
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          {/* Row 2: Mark Attendance Full Width Button */}
          <Button 
            className="w-full justify-center shadow-sm"
            onClick={() => {
              setEditAttendanceData(null);
              setIsMarkModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-1.5" /> Mark Attendance
          </Button>

        </div>

        {/* MAIN SECTION: Desktop par Calendar + List, Mobile par sirf List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Desktop par Calendar show hoga, Mobile par hidden rahega */}
          <div className="hidden lg:block lg:col-span-2">
            <AttendanceCalendar
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              records={monthRecords ?? []}
              selectedDate={selectedDate}
              onDayClick={setSelectedDate}
              onMarkAttendanceClick={() => {
                setEditAttendanceData(null);
                setIsMarkModalOpen(true);
              }}
            />
          </div>

        {/* DELETE CONFIRMATION MODAL */}
      {deleteLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-card border border-border bg-background p-6 space-y-4 max-w-sm w-full shadow-lg">
            <h3 className="text-base font-semibold text-text-primary">Delete Leave Request</h3>
            <p className="text-xs text-text-secondary">
              Are you sure you want to delete this leave request? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDeleteLeaveId(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => {
                  deleteLeaveRequest(deleteLeaveId);
                  setDeleteLeaveId(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
          {/* Check-In / Check-Out List */}
          <div className="lg:col-span-1">
            <CheckInOutList
              title={`Attendance — ${format(selectedDate, 'MMM d, yyyy')}`}
              records={selectedDateRecords}
              isLoading={isLoading}
              onEditClick={(record) => {
                setEditAttendanceData(record);
                setIsMarkModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* LEAVE REQUESTS TABLE */}
        <LeaveRequestsTable
          requests={leaveRequests}
          isLoading={isLeaveLoading}
          onNewRequestClick={() => {
            setEditLeaveData(null);
            setIsLeaveModalOpen(true);
          }}
          onEditClick={(req) => {
            setEditLeaveData(req);
            setIsLeaveModalOpen(true);
          }}
          onDeleteClick={(id) => {
     setDeleteLeaveId(id);
  }}
          onUpdateStatus={(id, status) => {
            updateLeaveRequest({ id, status });
          }}
        />
      </div>

      <MarkAttendanceModal
        open={isMarkModalOpen}
        onOpenChange={setIsMarkModalOpen}
        initialDate={selectedDateKey}
        existingRecords={selectedDateRecords}
        editData={editAttendanceData}
      />
      
      <LeaveRequestModal 
        open={isLeaveModalOpen} 
        onOpenChange={setIsLeaveModalOpen} 
        editData={editLeaveData} 
      />
    </AppLayout>
  );  
}