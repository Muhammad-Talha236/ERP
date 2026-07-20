import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreatePurchaseOrder } from '../hooks/useCreatePurchaseOrder';

/**
 * poSchema — validates the New PO form. Every item must have a
 * material name, positive quantity, and non-negative unit price —
 * matching docs/API/05_API_Documentation_Part4.md validation rules.
 */
const poSchema = z.object({
  supplierName: z.string().min(1, 'Supplier is required'),
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

const defaultValues = {
  supplierName: '',
  items: [{ materialName: '', quantity: 1, unitPrice: 0 }],
};

/**
 * POFormModal — "New PO" form with a dynamic list of line items.
 * Uses react-hook-form's useFieldArray to let the admin add/remove
 * item rows freely, matching how a real purchase order is built.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function POFormModal({ open, onOpenChange }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(poSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const { mutate: createPO, isPending } = useCreatePurchaseOrder();

  const items = watch('items');
  const estimatedTotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  const onSubmit = (formData) => {
    createPO(
      { ...formData, createdDate: new Date().toISOString().slice(0, 10) },
      {
        onSuccess: () => {
          reset(defaultValues);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New Purchase Order"
      description="Create a new order to a supplier."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Creating...' : 'Create PO'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Supplier"
          required
          placeholder="e.g. IronCore Ltd."
          error={errors.supplierName?.message}
          {...register('supplierName')}
        />

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
              <div key={field.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-start">
                <Input
                  placeholder="Material name"
                  error={errors.items?.[index]?.materialName?.message}
                  {...register(`items.${index}.materialName`)}
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  className="w-20"
                  error={errors.items?.[index]?.quantity?.message}
                  {...register(`items.${index}.quantity`)}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Unit price"
                  className="w-28"
                  error={errors.items?.[index]?.unitPrice?.message}
                  {...register(`items.${index}.unitPrice`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 size={14} className="text-danger" />
                </Button>
              </div>
            ))}
          </div>

          {errors.items?.message && (
            <p className="text-xs text-danger mt-2">{errors.items.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <p className="text-sm text-text-secondary">
            Estimated total:{' '}
            <span className="text-text-primary font-semibold">
              ${estimatedTotal.toLocaleString()}
            </span>
          </p>
        </div>
      </form>
    </Modal>
  );
}