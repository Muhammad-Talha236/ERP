import PropTypes from 'prop-types';
import { PayrollRow } from './PayrollRow';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Wallet } from 'lucide-react';

const COLUMNS = ['EMPLOYEE', 'DEPARTMENT', 'BASE', 'OVERTIME', 'DEDUCTIONS', 'NET', 'STATUS', ''];

/**
 * PayrollTable — payroll table body.
 *
 * @param {Object} props
 * @param {WageRecord[]} props.wages
 * @param {boolean} props.isLoading
 * @param {(wage: WageRecord) => void} props.onPayClick
 */
export function PayrollTable({ wages, isLoading, onPayClick }) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!wages || wages.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No payroll records found"
        description="Payroll records for this period will appear here once generated."
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
          {wages.map((wage) => (
            <PayrollRow key={wage.id} wage={wage} onPayClick={onPayClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

PayrollTable.propTypes = {
  wages: PropTypes.array,
  isLoading: PropTypes.bool,
  onPayClick: PropTypes.func.isRequired,
};