import PropTypes from 'prop-types';
import { PayrollRow } from './PayrollRow';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApproveWage } from '../hooks/useApproveWage';
import {
  getWageStatusVariant,
  getPayrollStatusVariant,
} from '../utils/wageStatusVariant';

const COLUMNS = [
  'EMPLOYEE',
  'DEPARTMENT',
  'BASE',
  'OVERTIME',
  'DEDUCTIONS',
  'NET',
  'STATUS',
  '',
];

/**
 * Mobile Payroll Card
 */
function PayrollMobileCard({ wage, onPayClick }) {
  const remaining =
    Number(wage.netAmount) -
    Number(wage.amountPaid);

  const canPay =
    wage.status === 'Approved' && remaining > 0;

  const canApprove =
    wage.status === 'Calculated';

  const {
    mutate: approve,
    isPending: isApproving,
  } = useApproveWage();

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
      {/* Employee + Department */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-text-primary">
            {wage.employeeName}
          </p>

          <p className="mt-1 truncate text-sm text-text-secondary">
            {wage.department}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge
            variant={getPayrollStatusVariant(
              wage.status
            )}
          >
            {wage.status}
          </Badge>

          {(wage.status === 'Approved' ||
            wage.status === 'Paid') && (
            <Badge
              variant={getWageStatusVariant(
                wage.paymentStatus
              )}
            >
              {wage.paymentStatus}
            </Badge>
          )}
        </div>
      </div>

      {/* Payroll Details */}
      <div className="grid grid-cols-2 gap-3 border-y border-border py-4">
        {/* Base */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Base
          </p>

          <p className="mt-1 text-sm font-semibold text-text-primary">
            $
            {Number(
              wage.grossAmount
            ).toLocaleString()}
          </p>
        </div>

        {/* Overtime */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Overtime
          </p>

          <p className="mt-1 text-sm font-semibold text-text-primary">
            {wage.overtimeAmount > 0
              ? `+$${Number(
                  wage.overtimeAmount
                ).toLocaleString()}`
              : '+$0'}
          </p>
        </div>

        {/* Deductions */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Deductions
          </p>

          <p className="mt-1 text-sm font-semibold text-text-primary">
            -$
            {Number(
              wage.deductions
            ).toLocaleString()}
          </p>
        </div>

        {/* Net */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            Net
          </p>

          <p className="mt-1 text-base font-bold text-text-primary">
            $
            {Number(
              wage.netAmount
            ).toLocaleString()}
          </p>

          {wage.paymentStatus === 'Partial' && (
            <p className="mt-1 text-xs text-text-secondary">
              ${remaining.toLocaleString()}{' '}
              remaining
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {(canApprove || canPay) && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {canApprove && (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => approve(wage.id)}
              disabled={isApproving}
            >
              {isApproving
                ? 'Approving...'
                : 'Approve'}
            </Button>
          )}

          {canPay && (
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => onPayClick(wage)}
            >
              Pay
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

PayrollMobileCard.propTypes = {
  wage: PropTypes.object.isRequired,
  onPayClick: PropTypes.func.isRequired,
};

/**
 * PayrollTable
 */
export function PayrollTable({
  wages,
  isLoading,
  onPayClick,
}) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!wages || wages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-background">
      {/* ==========================================
          DESKTOP TABLE
      ========================================== */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col, index) => (
                <th
                  key={`${col}-${index}`}
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary ${
                    index === COLUMNS.length - 1
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {wages.map((wage) => (
              <PayrollRow
                key={wage.id}
                wage={wage}
                onPayClick={onPayClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ==========================================
          MOBILE / TABLET CARDS
      ========================================== */}

      <div className="space-y-3 p-3 sm:p-4 lg:hidden">
        {wages.map((wage) => (
          <PayrollMobileCard
            key={wage.id}
            wage={wage}
            onPayClick={onPayClick}
          />
        ))}
      </div>
    </div>
  );
}

PayrollTable.propTypes = {
  wages: PropTypes.array,
  isLoading: PropTypes.bool,
  onPayClick: PropTypes.func.isRequired,
};