import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUpdatePayment } from '@/features/wages/hooks/useUpdatePayment';
import { useUpdatePOPayment } from '@/features/stockOrder/hooks/useUpdatePOPayment';

/**
 * PaymentHistoryItem — a single payment/advance transaction row,
 * with inline editing. Shared between Wages and Purchase Orders
 * since both modules track payments/advances identically.
 *
 * @param {Object} props
 * @param {PaymentTransaction|POPaymentTransaction} props.entry
 * @param {'wage'|'po'} [props.scope] - which update hook to call
 */
export function PaymentHistoryItem({ entry, scope = 'wage' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(entry.amount);
  const [remarks, setRemarks] = useState(entry.remarks ?? '');
  const [errorMessage, setErrorMessage] = useState(null);

  const wageUpdate = useUpdatePayment();
  const poUpdate = useUpdatePOPayment();
  const { mutate: updatePayment, isPending } = scope === 'po' ? poUpdate : wageUpdate;

  const handleSave = () => {
    setErrorMessage(null);
    updatePayment(
      { transactionId: entry.id, amount: Number(amount), remarks },
      {
        onSuccess: () => setIsEditing(false),
        onError: (err) => setErrorMessage(err.message || 'Update failed.'),
      }
    );
  };

  const handleCancel = () => {
    setAmount(entry.amount);
    setRemarks(entry.remarks ?? '');
    setErrorMessage(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-input border border-primary/40 px-4 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>
        {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isPending}>
            <X size={14} /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isPending}>
            <Check size={14} /> {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-input border border-border px-4 py-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-primary">${entry.amount.toLocaleString()}</p>
          <Badge variant={entry.type === 'Advance' ? 'warning' : 'success'}>{entry.type}</Badge>
        </div>
        {entry.remarks && <p className="text-xs text-text-secondary mt-0.5">{entry.remarks}</p>}
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xs text-text-secondary">{format(new Date(entry.date), 'MMM d, yyyy')}</p>
        <button type="button" onClick={() => setIsEditing(true)} className="text-text-secondary hover:text-primary transition-colors" aria-label="Edit payment">
          <Pencil size={14} />
        </button>
      </div>
    </div>
  );
}

PaymentHistoryItem.propTypes = {
  entry: PropTypes.object.isRequired,
  scope: PropTypes.oneOf(['wage', 'po']),
};