import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { PaymentHistoryItem } from './PaymentHistoryItem';
import { useRecordPayment } from '../hooks/useRecordPayment';
import { usePaymentHistory } from '../hooks/usePaymentHistory';

/**
 * PayWageModal — records a payment or advance for ONE employee's
 * wage record, and shows/edits that record's full payment history.
 *
 * Type (Payment vs Advance) is chosen via the dropdown inside the
 * form — no separate entry point needed.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {WageRecord|null} props.wage
 */
export function PayWageModal({ open, onOpenChange, wage }) {
  const [errorMessage, setErrorMessage] = useState(null);

  const remaining = wage ? wage.netAmount - wage.amountPaid : 0;

  const paymentSchema = z.object({
    amount: z.coerce
      .number()
      .positive('Amount must be greater than 0')
      .max(remaining, `Amount cannot exceed the remaining balance of $${remaining.toLocaleString()}`),
    type: z.enum(['Payment', 'Advance']),
    remarks: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    values: wage ? { amount: remaining, type: 'Payment', remarks: '' } : undefined,
  });

  const { mutate: recordPayment, isPending } = useRecordPayment();
  const { data: history, isLoading: isHistoryLoading } = usePaymentHistory(wage?.id);

  const onSubmit = (formData) => {
    setErrorMessage(null);
    recordPayment(
      { wageId: wage.id, ...formData },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
        onError: (err) => setErrorMessage(err.message || 'Payment failed.'),
      }
    );
  };

  if (!wage) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Pay ${wage.employeeName}`}
      description={`Net amount: $${wage.netAmount.toLocaleString()} · Already paid: $${wage.amountPaid.toLocaleString()} · Remaining: $${remaining.toLocaleString()}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending || remaining <= 0}>
            {isPending ? 'Recording...' : 'Record Payment'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {remaining <= 0 ? (
          <p className="text-sm text-success font-semibold">
            This employee has already been paid in full for this period.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              required
              error={errors.amount?.message}
              {...register('amount')}
            />
            <Select
              label="Type"
              required
              error={errors.type?.message}
              options={[
                { label: 'Payment', value: 'Payment' },
                { label: 'Advance', value: 'Advance' },
              ]}
              {...register('type')}
            />
            <div className="col-span-2">
              <Input
                label="Remarks"
                placeholder="Optional note (e.g. reason for advance)"
                error={errors.remarks?.message}
                {...register('remarks')}
              />
            </div>

            {errorMessage && <p className="col-span-2 text-sm text-danger">{errorMessage}</p>}
          </form>
        )}

        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Payment History</h4>

          {isHistoryLoading ? (
            <LoadingSkeleton rows={2} />
          ) : !history || history.length === 0 ? (
            <p className="text-sm text-text-secondary">No payments recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <PaymentHistoryItem key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

PayWageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  wage: PropTypes.object,
};