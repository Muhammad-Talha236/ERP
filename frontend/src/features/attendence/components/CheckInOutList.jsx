import { useState } from 'react';
import { ClipboardList, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAttendanceStatusVariant } from '../utils/attendanceStatusVariant';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';

export function CheckInOutList({ records, isLoading, title = 'Check-in / Check-out', onEditClick }) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination Logic
  const safeRecords = records || [];
  const totalPages = Math.max(1, Math.ceil(safeRecords.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  
  const currentData = safeRecords.slice(
    (validPage - 1) * itemsPerPage,
    validPage * itemsPerPage
  );

  return (
    <div className="rounded-card border border-border bg-background p-6 h-full flex flex-col">
      {/* Title Header - Removed Export Button */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : safeRecords.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No records for this day"
          description="Attendance check-ins will appear here once marked."
        />
      ) : (
        <div className="flex flex-col flex-1 justify-between">
          
          {/* Employee List Items */}
          <div className="space-y-2">
            {currentData.map((record) => (
              <div 
                key={record.id} 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-border/50 gap-2"
              >
                {/* Left Side: Avatar + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={record.employeeName} size="sm" className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {record.employeeName}
                    </p>
                    <p className="text-[11px] text-text-secondary mt-0.5 truncate tracking-wide">
                      {/* Seconds remove karne ke liye .slice(0, 5) use kiya hai */}
                      {record.checkIn ? `In ${record.checkIn.slice(0, 5)}` : ''}
                      {record.checkOut ? ` — Out ${record.checkOut.slice(0, 5)}` : ''}
                      {!record.checkIn && !record.checkOut ? 'No time recorded' : ''}
                    </p>
                  </div>
                </div>
                
                {/* Right Side: Badge + Edit Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={getAttendanceStatusVariant(record.status)}>
                    {record.status}
                  </Badge>
                  <button
                    onClick={() => onEditClick(record)}
                    className="p-1.5 rounded-md text-text-secondary hover:text-primary hover:bg-primary/10 transition-all"
                    title="Edit Attendance"
                  >
                    <Pencil size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <span className="text-xs font-medium text-text-secondary">
                {(validPage - 1) * itemsPerPage + 1}-{Math.min(validPage * itemsPerPage, safeRecords.length)} of {safeRecords.length}
              </span>
              
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validPage === 1}
                >
                  <ChevronLeft size={14} />
                </Button>
                <span className="text-xs font-bold text-text-primary w-8 text-center">
                  {validPage}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={validPage === totalPages}
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}

CheckInOutList.propTypes = {
  records: PropTypes.array,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  onEditClick: PropTypes.func,
};