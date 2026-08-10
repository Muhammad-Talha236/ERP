import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApproveWage } from '../hooks/useApproveWage';

/**
 * Resolve workflow + payment status
 * into one display status.
 */
function resolveDisplayStatus(row) {
  if (!row.wageId) {
    return {
      label: 'Not Generated',
      variant: 'neutral',
    };
  }

  if (row.status === 'Paid') {
    return {
      label: 'Paid',
      variant: 'success',
    };
  }

  if (
    row.status === 'Approved' &&
    row.paymentStatus === 'Partial'
  ) {
    return {
      label: 'Partial',
      variant: 'info',
    };
  }

  if (row.status === 'Approved') {
    return {
      label: 'Approved',
      variant: 'warning',
    };
  }

  if (row.status === 'Calculated') {
    return {
      label: 'Calculated',
      variant: 'info',
    };
  }

  return {
    label: 'Draft',
    variant: 'neutral',
  };
}

export function PayrollOverviewRow({
  row,
  onPayClick,
  onEditClick,
  onGenerateClick,
  mobile = false,
}) {
  const {
    mutate: approve,
    isPending: isApproving,
  } = useApproveWage();

  const hasWage = Boolean(row.wageId);

  const remaining =
    Number(row.netAmount || 0) -
    Number(row.amountPaid || 0);

  const canApprove =
    hasWage && row.status === 'Calculated';

  const canEdit =
    hasWage &&
    (row.status === 'Draft' ||
      row.status === 'Calculated');

  const canPay =
    hasWage &&
    (row.status === 'Approved' ||
      row.status === 'Paid') &&
    remaining > 0;

  const displayStatus =
    resolveDisplayStatus(row);

  /*
   * =====================================================
   * MOBILE / TABLET CARD
   * =====================================================
   */

  if (mobile) {
    return (
      <div className="w-full min-w-0 rounded-xl border border-border bg-background p-4 shadow-sm">
        {/* Employee + Status */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-text-primary">
              {row.employeeName}
            </p>

            <p className="mt-1 truncate text-sm text-text-secondary">
              {row.department}
            </p>
          </div>

          <Badge
            variant={displayStatus.variant}
            className="shrink-0"
          >
            {displayStatus.label}
          </Badge>
        </div>

        {/* Payroll Details */}
        <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
          {/* Base Salary */}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Base Salary
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-text-primary">
              $
              {Number(
                row.baseSalary || 0
              ).toLocaleString()}
            </p>
          </div>

          {/* Overtime */}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Overtime
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-text-primary">
              {row.overtimeAmount > 0
                ? `+$${Number(
                    row.overtimeAmount
                  ).toLocaleString()}`
                : '—'}
            </p>
          </div>

          {/* Net */}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              Net
            </p>

            <p className="mt-1 truncate text-base font-bold text-text-primary">
              {hasWage
                ? `$${Number(
                    row.netAmount || 0
                  ).toLocaleString()}`
                : '—'}
            </p>
          </div>

          {/* Remaining */}
          {hasWage &&
            row.paymentStatus === 'Partial' && (
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  Remaining
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-text-primary">
                  $
                  {remaining.toLocaleString()}
                </p>
              </div>
            )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {!hasWage && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() =>
                onGenerateClick(row)
              }
            >
              Generate
            </Button>
          )}

          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() =>
                onEditClick(row)
              }
            >
              Edit
            </Button>
          )}

          {canApprove && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() =>
                approve(row.wageId)
              }
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
              className="flex-1 sm:flex-none"
              onClick={() =>
                onPayClick(row)
              }
            >
              Pay
            </Button>
          )}
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * DESKTOP TABLE ROW
   * =====================================================
   */

  return (
    <tr className="border-b border-border last:border-0">
      {/* Employee */}
      <td className="w-[18%] px-3 py-4 xl:px-4">
        <p className="truncate text-sm font-semibold text-text-primary">
          {row.employeeName}
        </p>
      </td>

      {/* Department */}
      <td className="w-[18%] px-3 py-4 xl:px-4">
        <p className="truncate text-sm text-text-secondary">
          {row.department}
        </p>
      </td>

      {/* Base Salary */}
      <td className="w-[15%] whitespace-nowrap px-3 py-4 text-sm text-text-primary xl:px-4">
        $
        {Number(
          row.baseSalary || 0
        ).toLocaleString()}
      </td>

      {/* Overtime */}
      <td className="w-[13%] whitespace-nowrap px-3 py-4 text-sm text-text-primary xl:px-4">
        {row.overtimeAmount > 0
          ? `+$${Number(
              row.overtimeAmount
            ).toLocaleString()}`
          : '—'}
      </td>

      {/* Net */}
      <td className="w-[14%] px-3 py-4 xl:px-4">
        {hasWage ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              $
              {Number(
                row.netAmount || 0
              ).toLocaleString()}
            </p>

            {row.paymentStatus ===
              'Partial' && (
              <p className="truncate text-xs text-text-secondary">
                ${remaining.toLocaleString()}{' '}
                remaining
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-text-secondary">
            —
          </span>
        )}
      </td>

      {/* Status */}
      <td className="w-[12%] px-3 py-4 xl:px-4">
        <Badge variant={displayStatus.variant}>
          {displayStatus.label}
        </Badge>
      </td>

      {/* Actions */}
      <td className="w-[10%] px-3 py-4 xl:px-4">
        <div className="flex justify-end gap-1 whitespace-nowrap xl:gap-2">
          {!hasWage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onGenerateClick(row)
              }
            >
              Generate
            </Button>
          )}

          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onEditClick(row)
              }
            >
              Edit
            </Button>
          )}

          {canApprove && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                approve(row.wageId)
              }
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
              onClick={() =>
                onPayClick(row)
              }
            >
              Pay
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

PayrollOverviewRow.propTypes = {
  row: PropTypes.object.isRequired,
  onPayClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onGenerateClick: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
};