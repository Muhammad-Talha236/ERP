import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getWageStatusVariant } from '../utils/wageStatusVariant';

/**
 * PayrollRow — a single row in the payroll table.
 *
 * Single "Pay" action opens PayWageModal, where the admin chooses
 * Payment vs Advance from the Type dropdown inside the form itself —
 * no separate button needed since the dropdown already covers both.
 *
 * @param {Object} props
 * @param {WageRecord} props.wage
 * @param {(wage: WageRecord) => void} props.onPayClick
 */
export function PayrollRow({ wage, onPayClick }) {
  const remaining = wage.netAmount - wage.amountPaid;
  const canPay = remaining > 0;

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
        <Badge variant={getWageStatusVariant(wage.paymentStatus)}>{wage.paymentStatus}</Badge>
      </td>
      <td className="py-4 text-right">
        {canPay && (
          <Button variant="outline" size="sm" onClick={() => onPayClick(wage)}>
            Pay
          </Button>
        )}
      </td>
    </tr>
  );
}

PayrollRow.propTypes = {
  wage: PropTypes.object.isRequired,
  onPayClick: PropTypes.func.isRequired,
};