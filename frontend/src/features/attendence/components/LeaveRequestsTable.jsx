import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getLeaveRequestStatusVariant } from '../utils/attendanceStatusVariant';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CalendarX } from 'lucide-react';

const COLUMNS = ['EMPLOYEE', 'TYPE', 'FROM', 'TO', 'STATUS'];

/**
 * LeaveRequestsTable — table of pending/processed leave requests
 * at the bottom of the Attendance page.
 *
 * @param {Object} props
 * @param {LeaveRequest[]} props.requests
 * @param {boolean} props.isLoading
 * @param {() => void} props.onNewRequestClick
 */
export function LeaveRequestsTable({ requests, isLoading, onNewRequestClick }) {
  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-text-primary">Leave Requests</h3>
        <Button size="sm" onClick={onNewRequestClick}>
          New request
        </Button>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : !requests || requests.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No leave requests"
          description="New leave requests submitted by employees will appear here."
        />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-border last:border-0">
                <td className="py-4 text-sm font-semibold text-text-primary">
                  {req.employeeName}
                </td>
                <td className="py-4 text-sm text-text-secondary">{req.type}</td>
                <td className="py-4 text-sm text-text-secondary">
                  {format(new Date(req.fromDate), 'MMM d')}
                </td>
                <td className="py-4 text-sm text-text-secondary">
                  {format(new Date(req.toDate), 'MMM d')}
                </td>
                <td className="py-4">
                  <Badge variant={getLeaveRequestStatusVariant(req.status)}>
                    {req.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

LeaveRequestsTable.propTypes = {
  requests: PropTypes.array,
  isLoading: PropTypes.bool,
  onNewRequestClick: PropTypes.func,
};