import { UserPlus, TrendingUp, ArrowRightLeft, DollarSign, RefreshCw, History } from 'lucide-react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';

/**
 * TYPE_CONFIG — maps a work history entry's `type` to an icon and
 * accent color. Kept local to this component since it's the only
 * place this mapping is used.
 */
const TYPE_CONFIG = {
  Hired: { icon: UserPlus, color: 'text-success bg-success/15' },
  Promotion: { icon: TrendingUp, color: 'text-primary bg-primary/15' },
  Transfer: { icon: ArrowRightLeft, color: 'text-info bg-info/15' },
  'Salary Change': { icon: DollarSign, color: 'text-warning bg-warning/15' },
  'Status Change': { icon: RefreshCw, color: 'text-text-secondary bg-text-secondary/15' },
};

/**
 * EmployeeWorkHistoryList — vertical timeline of an employee's
 * work history (hires, promotions, transfers, salary/status changes).
 *
 * Presentational only — data fetching (useEmployeeWorkHistory)
 * happens in the parent page component, keeping this component
 * easy to reuse/test independent of React Query.
 *
 * @param {Object} props
 * @param {WorkHistoryEntry[]} props.entries
 * @param {boolean} props.isLoading
 */
export function EmployeeWorkHistoryList({ entries, isLoading }) {
  if (isLoading) {
    return <LoadingSkeleton rows={3} />;
  }

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No work history yet"
        description="Changes to this employee's role, department, or salary will appear here."
      />
    );
  }

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Work History</h3>

      <div className="space-y-5">
        {entries.map((entry) => {
          const config = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG['Status Change'];
          const Icon = config.icon;

          return (
            <div key={entry.id} className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon size={14} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary">{entry.type}</p>
                  <span className="text-xs text-text-secondary">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mt-0.5">{entry.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

EmployeeWorkHistoryList.propTypes = {
  entries: PropTypes.array,
  isLoading: PropTypes.bool,
};