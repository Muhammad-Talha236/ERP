import PropTypes from 'prop-types';
import { PayrollOverviewRow } from './PayrollOverviewRow';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Wallet } from 'lucide-react';

const COLUMNS = ['EMPLOYEE', 'DEPARTMENT', 'BASE SALARY', 'OVERTIME', 'NET', 'STATUS', ''];

/**
 * PayrollOverviewTable — lists EVERY active employee for the period
 * (via useWagesOverview), not just ones with a generated wage row —
 * so base salary and a "Not Generated" status are always visible.
 */
export function PayrollOverviewTable({ rows, isLoading, onPayClick, onEditClick, onGenerateClick }) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No employees found"
        description="Add employees first to run payroll for them."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((col) => (
              <th key={col} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <PayrollOverviewRow
              key={row.employeeId}
              row={row}
              onPayClick={onPayClick}
              onEditClick={onEditClick}
              onGenerateClick={onGenerateClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

PayrollOverviewTable.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  onPayClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onGenerateClick: PropTypes.func.isRequired,
};