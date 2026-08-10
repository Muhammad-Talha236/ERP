
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCreatePurchaseOrder } from '../hooks/useCreatestockOrder';

const poSchema = z.object({
  supplierName: z.string().min(1, 'Supplier is required'),
  expectedDeliveryDate: z
    .string()
    .min(1, 'Expected delivery date is required'),
  items: z
    .array(
      z.object({
        materialName: z.string().min(1, 'Material name is required'),
        quantity: z.coerce
          .number()
          .positive('Quantity must be greater than 0'),
        unitPrice: z.coerce
          .number()
          .min(0, 'Unit price must be 0 or greater'),
      })
    )
    .min(1, 'At least one item is required'),
});

const defaultValues = {
  supplierName: '',
  expectedDeliveryDate: '',
  items: [{ materialName: '', quantity: 1, unitPrice: 0 }],
};

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { mutate: createPO, isPending } = useCreatePurchaseOrder();

  const items = watch('items');

  const estimatedTotal = (items || []).reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity) || 0) *
        (Number(item.unitPrice) || 0),
    0
  );

  const onSubmit = (formData) => {
    createPO(
      {
        ...formData,
        createdDate: new Date().toISOString().split('T')[0],
      },
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
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="purchase-order-form"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? 'Creating...' : 'Create PO'}
          </Button>
        </div>
      }
    >
      <form
        id="purchase-order-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-5"
      >
        {/* Supplier & Delivery Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Supplier"
            required
            placeholder="e.g. IronCore Ltd."
            error={errors.supplierName?.message}
            {...register('supplierName')}
          />

          <Input
            label="Expected Delivery Date"
            type="date"
            required
            error={errors.expectedDeliveryDate?.message}
            {...register('expectedDeliveryDate')}
          />
        </div>

        {/* Items Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Items
          </h3>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              append({
                materialName: '',
                quantity: 1,
                unitPrice: 0,
              })
            }
            className="w-full sm:w-auto"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add item
          </Button>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-gray-200 p-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_100px_120px_auto] sm:items-start">
                {/* Material Name */}
                <div className="min-w-0">
                  <Input
                    placeholder="Material name"
                    error={
                      errors.items?.[index]?.materialName?.message
                    }
                    {...register(`items.${index}.materialName`)}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    className="w-full"
                    error={
                      errors.items?.[index]?.quantity?.message
                    }
                    {...register(`items.${index}.quantity`)}
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Unit price"
                    className="w-full"
                    error={
                      errors.items?.[index]?.unitPrice?.message
                    }
                    {...register(`items.${index}.unitPrice`)}
                  />
                </div>

                {/* Delete */}
                <div className="flex justify-end sm:pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Items Error */}
        {errors.items?.message && (
          <p className="text-sm text-red-500">
            {errors.items.message}
          </p>
        )}

        {/* Estimated Total */}
        <div className="flex flex-col gap-1 border-t pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <span className="text-sm text-gray-500">
            Estimated total:
          </span>

          <span className="text-lg font-semibold text-gray-900">
            ${estimatedTotal.toLocaleString()}
          </span>
        </div>
      </form>
    </Modal>
  );
}
