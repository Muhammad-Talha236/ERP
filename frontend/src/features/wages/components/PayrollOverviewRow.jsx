import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useApproveWage } from '../hooks/useApproveWage';

/**
 * resolveDisplayStatus — collapses payroll workflow status +
 * payment status into a SINGLE label/variant, so the table never
 * shows two stacked badges for one row.
 */
function resolveDisplayStatus(row) {
  if (!row.wageId) return { label: 'Not Generated', variant: 'neutral' };
  if (row.status === 'Paid') return { label: 'Paid', variant: 'success' };
  if (row.status === 'Approved' && row.paymentStatus === 'Partial') {
    return { label: 'Partial', variant: 'info' };
  }
  if (row.status === 'Approved') return { label: 'Approved', variant: 'warning' };
  if (row.status === 'Calculated') return { label: 'Calculated', variant: 'info' };
  return { label: 'Draft', variant: 'neutral' };
}

export function PayrollOverviewRow({ row, onPayClick, onEditClick, onGenerateClick }) {
  const { mutate: approve, isPending: isApproving } = useApproveWage();

  const hasWage = Boolean(row.wageId);
  const remaining = row.netAmount - row.amountPaid;
  const canApprove = hasWage && row.status === 'Calculated';
  const canEdit = hasWage && (row.status === 'Draft' || row.status === 'Calculated');
  const canPay = hasWage && (row.status === 'Approved' || row.status === 'Paid') && remaining > 0;

  const displayStatus = resolveDisplayStatus(row);

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
        <Badge variant={displayStatus.variant}>{displayStatus.label}</Badge>
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