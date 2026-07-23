import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Pencil, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { PaymentHistoryItem } from "@/features/wages/components/PaymentHistoryItem";
import { getPOStatusVariant, getPOPaymentVariant } from '../utils/stockOrderStatusVariant';
import { useUpdatePurchaseOrder } from '../hooks/useUpdatestockOrder';
import { useMarkPOAsReceived } from '../hooks/useMarkPOAsReceived';
import { useRecordPOPayment } from '../hooks/useRecordPOPayment';
import { usePOPaymentHistory } from '../hooks/usePOPaymentHistory';

/**
 * editSchema — validates the edit-mode form (supplier + items +
 * expected delivery date).
 */
const editSchema = z.object({
  supplierName: z.string().min(1, 'Supplier is required'),
  expectedDeliveryDate: z.string().min(1, 'Delivery date is required'),
  items: z
    .array(
      z.object({
        materialName: z.string().min(1, 'Material name is required'),
        quantity: z.coerce.number().positive('Quantity must be greater than 0'),
        unitPrice: z.coerce.number().min(0, 'Unit price must be 0 or greater'),
      })
    )
    .min(1, 'At least one item is required'),
});

/**
 * PODetailModal — the single modal that handles VIEWING a purchase
 * order's full details, EDITING it, recording payments/advances,
 * viewing payment history, and marking it as Received.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {PurchaseOrder|null} props.po
 */
export function PODetailModal({ open, onOpenChange, po }) {
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [paymentError, setPaymentError] = useState(null);

  const { mutate: updatePO, isPending: isUpdating } = useUpdatePurchaseOrder();
  const { mutate: markReceived, isPending: isMarkingReceived } = useMarkPOAsReceived();
  const { mutate: recordPayment, isPending: isPaying } = useRecordPOPayment();
  const { data: history, isLoading: isHistoryLoading } = usePOPaymentHistory(po?.id);

  const remaining = po ? po.totalAmount - po.paidAmount : 0;

  const paymentSchema = z.object({
    amount: z.coerce
      .number()
      .positive('Amount must be greater than 0')
      .max(remaining, `Amount cannot exceed the remaining balance of $${remaining.toLocaleString()}`),
    type: z.enum(['Payment', 'Advance']),
    remarks: z.string().optional(),
  });

  const editForm = useForm({
    resolver: zodResolver(editSchema),
    values: po
      ? { supplierName: po.supplierName, expectedDeliveryDate: po.expectedDeliveryDate, items: po.items }
      : undefined,
  });
  const { fields, append, remove } = useFieldArray({ control: editForm.control, name: 'items' });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    values: po ? { amount: remaining, type: 'Payment', remarks: '' } : undefined,
  });

  if (!po) return null;

  const handleEditSubmit = (formData) => {
    updatePO({ id: po.id, updates: formData }, { onSuccess: () => setMode('view') });
  };

  const handlePaymentSubmit = (formData) => {
    setPaymentError(null);
    recordPayment(
      { poId: po.id, ...formData },
      { onError: (err) => setPaymentError(err.message || 'Payment failed.') }
    );
  };

  const canReceive = po.status !== 'Received' && po.status !== 'Cancelled';

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setMode('view');
      }}
      title={mode === 'edit' ? `Edit ${po.poNumber}` : po.poNumber}
      description={mode === 'view' ? po.supplierName : 'Update order details.'}
      size="lg"
      footer={
        mode === 'edit' ? (
          <>
            <Button variant="secondary" onClick={() => setMode('view')} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={editForm.handleSubmit(handleEditSubmit)} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {canReceive && (
              <Button onClick={() => markReceived(po.id)} disabled={isMarkingReceived}>
                <CheckCircle2 size={16} />
                {isMarkingReceived ? 'Updating...' : 'Mark as Received'}
              </Button>
            )}
          </>
        )
      }
    >
      {mode === 'view' ? (
        <div className="space-y-6">
          {/* --- Status + edit trigger --- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={getPOStatusVariant(po.status)}>{po.status}</Badge>
              <Badge variant={getPOPaymentVariant(po.paymentStatus)}>{po.paymentStatus}</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMode('edit')}>
              <Pencil size={14} /> Edit
            </Button>
          </div>

          {/* --- Order info --- */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-secondary">Created</p>
              <p className="text-text-primary font-medium">{format(new Date(po.createdDate), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-text-secondary">Expected delivery</p>
              <p className="text-text-primary font-medium">
                {format(new Date(po.expectedDeliveryDate), 'MMM d, yyyy')}
              </p>
            </div>
            {po.receivedDate && (
              <div>
                <p className="text-text-secondary">Received on</p>
                <p className="text-success font-medium">{format(new Date(po.receivedDate), 'MMM d, yyyy')}</p>
              </div>
            )}
          </div>

          {/* --- Items --- */}
          <div>
            <p className="text-sm font-semibold text-text-primary mb-2">Items</p>
            <div className="rounded-input border border-border divide-y divide-border">
              {po.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                  <span className="text-text-primary">{item.materialName}</span>
                  <span className="text-text-secondary">
                    {item.quantity} × ${item.unitPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-right text-sm font-semibold text-text-primary mt-2">
              Total: ${po.totalAmount.toLocaleString()}
            </p>
          </div>

          {/* --- Payment form --- */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-semibold text-text-primary mb-1">Payment</p>
            <p className="text-xs text-text-secondary mb-3">
              Paid: ${po.paidAmount.toLocaleString()} · Remaining: ${remaining.toLocaleString()}
            </p>

            {remaining <= 0 ? (
              <p className="text-sm text-success font-semibold">This order has been paid in full.</p>
            ) : (
              <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  error={paymentForm.formState.errors.amount?.message}
                  {...paymentForm.register('amount')}
                />
                <Select
                  label="Type"
                  options={[
                    { label: 'Payment', value: 'Payment' },
                    { label: 'Advance', value: 'Advance' },
                  ]}
                  {...paymentForm.register('type')}
                />
                <Button type="submit" disabled={isPaying}>
                  {isPaying ? 'Recording...' : 'Record'}
                </Button>
              </form>
            )}
            {paymentError && <p className="text-xs text-danger mt-2">{paymentError}</p>}
          </div>

          {/* --- Payment history --- */}
          <div>
            <p className="text-sm font-semibold text-text-primary mb-3">Payment History</p>
            {isHistoryLoading ? (
              <LoadingSkeleton rows={2} />
            ) : !history || history.length === 0 ? (
              <p className="text-sm text-text-secondary">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((entry) => (
                  <PaymentHistoryItem key={entry.id} entry={entry} scope="po" />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Supplier"
              required
              error={editForm.formState.errors.supplierName?.message}
              {...editForm.register('supplierName')}
            />
            <Input
              label="Expected Delivery Date"
              type="date"
              required
              error={editForm.formState.errors.expectedDeliveryDate?.message}
              {...editForm.register('expectedDeliveryDate')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-text-primary">Items</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ materialName: '', quantity: 1, unitPrice: 0 })}
              >
                <Plus size={14} /> Add item
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-2">
                  <Input placeholder="Material name" {...editForm.register(`items.${index}.materialName`)} />
                  <Input type="number" placeholder="Qty" className="w-20" {...editForm.register(`items.${index}.quantity`)} />
                  <Input type="number" step="0.01" placeholder="Unit price" className="w-28" {...editForm.register(`items.${index}.unitPrice`)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <Trash2 size={14} className="text-danger" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}

PODetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  po: PropTypes.object,
};