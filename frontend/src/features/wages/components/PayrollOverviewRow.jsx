import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getWageStatusVariant, getPayrollStatusVariant } from '../utils/wageStatusVariant';
import { useApproveWage } from '../hooks/useApproveWage';

/**
 * PayrollOverviewRow — one employee's row on the payroll page.
 * Always shows base salary. Actions change based on where this
 * employee's payroll stands for the period:
 *  - No wage yet          -> Generate
 *  - Draft / Calculated   -> Edit (recompute) + Approve (if Calculated)
 *  - Approved / Paid      -> Pay (also lets you view/edit past payments)
 */
export function PayrollOverviewRow({ row, onPayClick, onEditClick, onGenerateClick }) {
  const { mutate: approve, isPending: isApproving } = useApproveWage();

  const hasWage = Boolean(row.wageId);
  const remaining = row.netAmount - row.amountPaid;
  const canApprove = hasWage && row.status === 'Calculated';
  const canEdit = hasWage && (row.status === 'Draft' || row.status === 'Calculated');
  const canPay = hasWage && (row.status === 'Approved' || row.status === 'Paid');

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-4 text-sm font-semibold text-text-primary">{row.employeeName}</td>
      <td className="py-4 text-sm text-text-secondary">{row.department}</td>
      <td className="py-4 text-sm text-text-primary">${row.baseSalary.toLocaleString()}</td>
      <td className="py-4 text-sm text-success">
        {row.overtimeAmount > 0 ? `+$${row.overtimeAmount.toLocaleString()}` : '—'}
      </td>
      <td className="py-4 text-sm font-semibold text-text-primary">
        {hasWage ? `$${row.netAmount.toLocaleString()}` : '—'}
        {hasWage && row.paymentStatus === 'Partial' && (
          <span className="block text-xs font-normal text-text-secondary">
            ${remaining.toLocaleString()} remaining
          </span>
        )}
      </td>
      <td className="py-4">
        <div className="flex flex-col gap-1 items-start">
          <Badge variant={getPayrollStatusVariant(row.status)}>{hasWage ? row.status : 'Not Generated'}</Badge>
          {hasWage && (row.status === 'Approved' || row.status === 'Paid') && (
            <Badge variant={getWageStatusVariant(row.paymentStatus)}>{row.paymentStatus}</Badge>
          )}
        </div>
      </td>
      <td className="py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {!hasWage && (
            <Button variant="outline" size="sm" onClick={() => onGenerateClick(row)}>
              Generate
            </Button>
          )}
          {canEdit && (
            <Button variant="outline" size="sm" onClick={() => onEditClick(row)}>
              Edit
            </Button>
          )}
          {canApprove && (
            <Button variant="outline" size="sm" onClick={() => approve(row.wageId)} disabled={isApproving}>
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
          )}
          {canPay && (
            <Button variant="outline" size="sm" onClick={() => onPayClick(row)}>
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
};