import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getWageStatusVariant, getPayrollStatusVariant } from '../utils/wageStatusVariant';
import { useApproveWage } from '../hooks/useApproveWage';

/**
 * PayrollRow — one row in the payroll table. Now carries the
 * payroll WORKFLOW status (Draft/Calculated/Approved/Paid)
 * alongside the payment status, with an inline Approve action
 * once it's Calculated.
 */
export function PayrollRow({ wage, onPayClick }) {
  const remaining = wage.netAmount - wage.amountPaid;
  const canPay = wage.status === 'Approved' && remaining > 0;
  const canApprove = wage.status === 'Calculated';

  const { mutate: approve, isPending: isApproving } = useApproveWage();

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-4 text-sm font-semibold text-text-primary">{wage.employeeName}</td>
      <td className="py-4 text-sm text-text-secondary">{wage.department}</td>
      <td className="py-4 text-sm text-text-primary">${wage.grossAmount.toLocaleString()}</td>
      <td className="py-4 text-sm text-success">
        {wage.overtimeAmount > 0 ? `+$${wage.overtimeAmount.toLocaleString()}` : '+$0'}
      </td>
      <td className="py-4 text-sm text-danger">-${wage.deductions.toLocaleString()}</td>
      <td className="py-4 text-sm font-semibold text-text-primary">
        ${wage.netAmount.toLocaleString()}
        {wage.paymentStatus === 'Partial' && (
          <span className="block text-xs font-normal text-text-secondary">
            ${remaining.toLocaleString()} remaining
          </span>
        )}
      </td>
      <td className="py-4">
        <div className="flex flex-col gap-1 items-start">
          <Badge variant={getPayrollStatusVariant(wage.status)}>{wage.status}</Badge>
          {wage.status === 'Approved' || wage.status === 'Paid' ? (
            <Badge variant={getWageStatusVariant(wage.paymentStatus)}>{wage.paymentStatus}</Badge>
          ) : null}
        </div>
      </td>
      <td className="py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {canApprove && (
            <Button variant="outline" size="sm" onClick={() => approve(wage.id)} disabled={isApproving}>
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
          )}
          {canPay && (
            <Button variant="outline" size="sm" onClick={() => onPayClick(wage)}>
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