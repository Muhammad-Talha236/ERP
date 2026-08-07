import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useUpdateProductionOrder } from '../hooks/useUpdateProductionOrder';

export function EditOrderModal({ open, onOpenChange, order }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      customerName: '',
      productName: '',
      quantity: 0,
      unitPrice: 0,
      priority: 'Medium',
      status: 'Pending',
      deliveryDate: '',
    },
  });

  const { mutate: updateOrder, isPending } = useUpdateProductionOrder();

  // Jab order prop badle (naya order edit ke liye khula), form ko us data se pre-fill karein
  useEffect(() => {
    if (order) {
      reset({
        customerName: order.customerName || '',
        productName: order.productName || '',
        quantity: order.quantity || 0,
        unitPrice: order.unitPrice || 0,
        priority: order.priority || 'Medium',
        status: order.status || 'Pending',
        deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
      });
    }
  }, [order, reset]);

  const onSubmit = (formData) => {
    updateOrder(
      {
        id: order.id,
        customer_name: formData.customerName,
        product_name: formData.productName,
        quantity: Number(formData.quantity),
        unit_price: Number(formData.unitPrice),
        priority: formData.priority,
        status: formData.status,
        delivery_date: formData.deliveryDate,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (err) => {
          console.error('Order update failed:', err);
        },
      }
    );
  };

  if (!order) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit Order — ${order.poNumber}`}
      description="Update this production order's details."
      size="lg"
      footer={
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
          Cancel
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Customer Name" required {...register('customerName')} />
          <Input label="Product Name" required {...register('productName')} />

          <Input label="Quantity" type="number" min="0" required {...register('quantity')} />
          <Input label="Unit Price" type="number" min="0" step="0.01" required {...register('unitPrice')} />

          <Select
            label="Priority"
            required
            options={[
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
            ]}
            {...register('priority')}
          />

          <Select
            label="Status"
            required
            options={[
              { label: 'Pending', value: 'Pending' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Quality Check', value: 'Quality Check' },
              { label: 'Completed', value: 'Completed' },
            ]}
            {...register('status')}
          />

          <Input label="Delivery Date" type="date" required {...register('deliveryDate')} />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}