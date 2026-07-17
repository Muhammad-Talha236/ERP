import { Download } from 'lucide-react';
import PropTypes from 'prop-types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAttendanceStatusVariant } from '../utils/attendanceStatusVariant';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ClipboardList } from 'lucide-react';

/**
 * CheckInOutList — today's check-in/check-out list with status
 * badges, matching the right-side panel in the design screenshot.
 *
 * @param {Object} props
 * @param {AttendanceRecord[]} props.records
 * @param {boolean} props.isLoading
 */
export function CheckInOutList({ records, isLoading }) {
  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-text-primary">Check-in / Check-out</h3>
        <Button variant="secondary" size="sm">
          <Download size={14} />
          Export
        </Button>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : records.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No records for today"
          description="Attendance check-ins will appear here once marked."
        />
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="flex items-center gap-3">
              <Avatar name={record.employeeName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {record.employeeName}
                </p>
                <p className="text-xs text-text-secondary">
                  {record.checkIn ? `In ${record.checkIn}` : '—'}
                  {record.checkOut ? ` · Out ${record.checkOut}` : ''}
                </p>
              </div>
              <Badge variant={getAttendanceStatusVariant(record.status)}>
                {record.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

CheckInOutList.propTypes = {
  records: PropTypes.array,
  isLoading: PropTypes.bool,
};