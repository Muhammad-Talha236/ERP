import { useState } from 'react';
import { Check, X, Pencil, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { format } from 'date-fns';

const COLUMNS = ['EMPLOYEE', 'TYPE', 'FROM', 'TO', 'STATUS', 'ACTIONS', 'EDIT', 'DELETE'];

const getStatusVariant = (status) => {
  switch (status) {
    case 'Approved': return 'success';
    case 'Rejected': return 'danger';
    case 'Pending': return 'warning';
    default: return 'neutral';
  }
};

/**
 * LeaveRequestsTable — table on tablet/desktop, stacked cards on
 * phone. Previously this was an 8-column table (EMPLOYEE, TYPE,
 * FROM, TO, STATUS, ACTIONS, EDIT, DELETE) inside a horizontally
 * scrolling wrapper — on phone that meant the user had to swipe
 * sideways through multiple screens just to see one row's status
 * or delete button. Same fix pattern as the Attendance page: a
 * dedicated mobile card layout with everything visible at once,
 * no side-scrolling needed.
 */
export function LeaveRequestsTable({ requests, isLoading, onNewRequestClick, onEditClick, onDeleteClick, onUpdateStatus }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  if (isLoading) {
    return <LoadingSkeleton rows={3} />;
  }

  const safeRequests = requests || [];
  const totalPages = Math.max(1, Math.ceil(safeRequests.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const currentData = safeRequests.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);

  const safeFormatDate = (dateStr) => (dateStr ? format(new Date(dateStr), 'MMM d, yyyy') : '-');

  return (
    <div className="rounded-card border border-border bg-background p-4 sm:p-6 space-y-4">
      {/* Header section: Mobile par title aur button neechay neechay adjust ho jayein */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Leave Requests</h3>
          <p className="text-xs text-text-secondary">Manage employee leave applications</p>
        </div>
        <Button onClick={onNewRequestClick} size="sm" className="w-full sm:w-auto justify-center">
          + New request
        </Button>
      </div>

      {safeRequests.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No leave requests"
          description="Submit a new leave request using the button above."
        />
      ) : (
        <div className="flex flex-col flex-1 justify-between">
          {/* Tablet/desktop: full table */}
          <div className="hidden md:block w-full overflow-x-auto pb-2">
            <table className="w-full min-w-[650px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="text-xs font-semibold text-text-secondary uppercase tracking-wide py-3 px-3 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((request) => (
                  <tr key={request.id} className="border-b border-border hover:bg-surface/60 transition-colors">
                    <td className="py-4 px-3 text-sm font-semibold text-text-primary whitespace-nowrap">
                      {request.employeeName || 'Unknown Employee'}
                    </td>
                    <td className="py-4 px-3 text-sm text-text-secondary whitespace-nowrap">{request.type}</td>
                    <td className="py-4 px-3 text-sm text-text-secondary whitespace-nowrap">
                      {safeFormatDate(request.fromDate)}
                    </td>
                    <td className="py-4 px-3 text-sm text-text-secondary whitespace-nowrap">
                      {safeFormatDate(request.toDate)}
                    </td>
                    <td className="py-4 px-3 whitespace-nowrap">
                      <Badge variant={getStatusVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-success hover:bg-success/15"
                          onClick={() => onUpdateStatus?.(request.id, 'Approved')}
                          title="Approve"
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger hover:bg-danger/15"
                          onClick={() => onUpdateStatus?.(request.id, 'Rejected')}
                          title="Reject"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </td>
                    <td className="py-4 px-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-text-secondary hover:text-text-primary"
                        onClick={() => onEditClick(request)}
                        title="Edit Request"
                      >
                        <Pencil size={16} />
                      </Button>
                    </td>
                    <td className="py-4 px-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-danger hover:bg-danger/15"
                        onClick={() => onDeleteClick(request.id)}
                        title="Delete Request"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phone: stacked cards, everything visible without side-scrolling */}
          <div className="md:hidden space-y-3">
            {currentData.map((request) => (
              <div key={request.id} className="rounded-input border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {request.employeeName || 'Unknown Employee'}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{request.type}</p>
                  </div>
                  <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                  <span>From: <span className="text-text-primary font-medium">{safeFormatDate(request.fromDate)}</span></span>
                  <span>To: <span className="text-text-primary font-medium">{safeFormatDate(request.toDate)}</span></span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-success hover:bg-success/15"
                      onClick={() => onUpdateStatus?.(request.id, 'Approved')}
                      title="Approve"
                    >
                      <Check size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-danger hover:bg-danger/15"
                      onClick={() => onUpdateStatus?.(request.id, 'Rejected')}
                      title="Reject"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-text-secondary hover:text-text-primary"
                      onClick={() => onEditClick(request)}
                      title="Edit Request"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-danger hover:bg-danger/15"
                      onClick={() => onDeleteClick(request.id)}
                      title="Delete Request"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <span className="text-xs font-medium text-text-secondary">
                {(validPage - 1) * itemsPerPage + 1}-{Math.min(validPage * itemsPerPage, safeRequests.length)} of {safeRequests.length}
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

LeaveRequestsTable.propTypes = {
  requests: PropTypes.array,
  isLoading: PropTypes.bool,
  onNewRequestClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
};