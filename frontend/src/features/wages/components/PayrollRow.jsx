import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  getWageStatusVariant,
  getPayrollStatusVariant,
} from '../utils/wageStatusVariant';
import { useApproveWage } from '../hooks/useApproveWage';

/**
 * PayrollRow — desktop table row.
 */
export function PayrollRow({ wage, onPayClick }) {
  const remaining =
    Number(wage.netAmount) - Number(wage.amountPaid);

  const canPay =
    wage.status === 'Approved' && remaining > 0;

  const canApprove =
    wage.status === 'Calculated';

  const {
    mutate: approve,
    isPending: isApproving,
  } = useApproveWage();

  return (
    <tr className="border-b border-border last:border-0">
      {/* Employee */}
      <td className="px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">
            {wage.employeeName}
          </p>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-4">
        <span className="text-sm text-text-secondary">
          {wage.department}
        </span>
      </td>

      {/* Base */}
      <td className="px-4 py-4 text-sm text-text-primary">
        ${Number(wage.grossAmount).toLocaleString()}
      </td>

      {/* Overtime */}
      <td className="px-4 py-4 text-sm text-text-primary">
        {wage.overtimeAmount > 0
          ? `+$${Number(
              wage.overtimeAmount
            ).toLocaleString()}`
          : '+$0'}
      </td>

      {/* Deductions */}
      <td className="px-4 py-4 text-sm text-text-primary">
        -$
        {Number(wage.deductions).toLocaleString()}
      </td>

      {/* Net */}
      <td className="px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            ${Number(wage.netAmount).toLocaleString()}
          </p>

          {wage.paymentStatus === 'Partial' && (
            <p className="mt-1 text-xs text-text-secondary">
              ${remaining.toLocaleString()} remaining
            </p>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <div className="flex min-w-[110px] flex-col items-start gap-1">
          <Badge variant={getPayrollStatusVariant(wage.status)}>
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
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          {canApprove && (
            <Button
              variant="outline"
              size="sm"
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
              onClick={() => onPayClick(wage)}
            >
              Pay
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

PayrollRow.propTypes = {
  wage: PropTypes.object.isRequired,
  onPayClick: PropTypes.func.isRequired,
};