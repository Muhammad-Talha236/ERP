import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getWageStatusVariant } from '../utils/wageStatusVariant';

/**
 * PayrollRow — a single row in the payroll table.
 *
 * Includes a per-row "Pay" action, visible only when the record's
 * status is Pending or Processing — this is the admin's control to
 * pay ONE employee at a time, instead of a blanket bulk action.
 *
 * @param {Object} props
 * @param {WageRecord} props.wage
 * @param {(id: string) => void} props.onPayClick
 * @param {boolean} props.isPaying - true only while THIS row's
 *        payment is in flight, so other rows' buttons stay usable
 */
export function PayrollRow({ wage, onPayClick, isPaying }) {
  const canPay = wage.paymentStatus === 'Pending' || wage.paymentStatus === 'Processing';

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
      </td>
      <td className="py-4">
        <Badge variant={getWageStatusVariant(wage.paymentStatus)}>{wage.paymentStatus}</Badge>
      </td>
      <td className="py-4 text-right">
        {canPay && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPayClick(wage.id)}
            disabled={isPaying}
          >
            {isPaying ? 'Paying...' : 'Pay'}
          </Button>
        )}
      </td>
    </tr>
  );
}

PayrollRow.propTypes = {
  wage: PropTypes.object.isRequired,
  onPayClick: PropTypes.func.isRequired,
  isPaying: PropTypes.bool,
};