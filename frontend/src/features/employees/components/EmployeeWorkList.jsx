import { useState } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';

/**
 * EmployeeWorkList — shows this employee's real production work,
 * pulled from workflow/bundle stage assignments (see
 * useEmployeeWorkAssignments). Paginated 5 rows per page, matching
 * the same pattern used by EmployeeTable / LeaveRequestsTable
 * elsewhere in the app, so it never grows beyond the space already
 * used by this section.
 *
 * @param {Object} props
 * @param {Array} props.work
 * @param {boolean} props.isLoading
 */
export function EmployeeWorkList({ work, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading) {
    return (
      <div className="rounded-card border border-border bg-background p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Production Work</h3>
        <LoadingSkeleton rows={3} />
      </div>
    );
  }

  const safeWork = work || [];

  if (safeWork.length === 0) {
    return (
      <div className="rounded-card border border-border bg-background p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Production Work</h3>
        <EmptyState
          icon={Briefcase}
          title="No production work yet"
          description="Workflow stage assignments for this employee will appear here."
        />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(safeWork.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const currentData = safeWork.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);

  const safeFormatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isValid(d) ? format(d, 'MMM d, yyyy') : null;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'info';
      case 'Assigned':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Production Work</h3>

      <div className="space-y-3">
        {currentData.map((item) => {
          const status = item.isDone ? 'Completed' : (item.status || 'Assigned');
          const dateLabel = safeFormatDate(item.completedAt) || safeFormatDate(item.updatedAt);

          return (
            <div
              key={`${item.bundleId ?? 'step'}-${item.id}`}
              className="flex items-center justify-between gap-3 rounded-input border border-border px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {item.poNumber || 'Unknown Order'}
                  </p>
                  {item.productName && (
                    <span className="text-xs text-text-secondary truncate">· {item.productName}</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5 truncate">
                  {item.stageName}
                  {item.wagePerPerson ? ` · $${Number(item.wagePerPerson).toLocaleString()}/person` : ''}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {dateLabel && (
                  <span className="text-xs text-text-secondary whitespace-nowrap">{dateLabel}</span>
                )}
                <Badge variant={getStatusVariant(status)}>{status}</Badge>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <span className="text-xs font-medium text-text-secondary">
            {(validPage - 1) * itemsPerPage + 1}-{Math.min(validPage * itemsPerPage, safeWork.length)} of {safeWork.length}
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
  );
}

EmployeeWorkList.propTypes = {
  work: PropTypes.array,
  isLoading: PropTypes.bool,
};