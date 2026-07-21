import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateProductionOrder } from '../hooks/useCreateProductionOrder';
import { customersMockData } from '@/mocks/data/customers.mock';
import { workflowTemplatesMockData } from '@/mocks/data/workflowTemplates.mock';

/**
 * newOrderSchema — validates the New Order form. Matches
 * PO Flow Step 1: "Client submits a requirement (e.g. 2,000 shirts
 * at a set price)".
 */
const newOrderSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  unitPrice: z.coerce.number().min(0, 'Unit price must be 0 or greater'),
  workflowTemplateId: z.string().min(1, 'Select a workflow'),
  priority: z.enum(['Low', 'Medium', 'High']),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
});

const defaultValues = {
  customerId: '',
  productName: '',
  quantity: 0,
  unitPrice: 0,
  workflowTemplateId: '',
  priority: 'Medium',
  deliveryDate: '',
};

/**
 * NewOrderFormModal — "New Order" form implementing PO Flow Steps 1-3.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function NewOrderFormModal({ open, onOpenChange }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newOrderSchema),
    defaultValues,
  });

  const { mutate: createOrder, isPending } = useCreateProductionOrder();

  const onSubmit = (formData) => {
    const customer = customersMockData.find((c) => c.id === formData.customerId);

    createOrder(
      { ...formData, customerName: customer.companyName },
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
      title="New Production Order"
      description="Submit a client requirement to start production."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Order'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <Select
          label="Customer"
          required
          error={errors.customerId?.message}
          options={[
            { label: 'Select customer', value: '' },
            ...customersMockData.map((c) => ({ label: c.companyName, value: c.id })),
          ]}
          {...register('customerId')}
        />
        <Input
          label="Product Name"
          required
          placeholder="e.g. Polo Shirt"
          error={errors.productName?.message}
          {...register('productName')}
        />

        <Input
          label="Quantity"
          type="number"
          required
          error={errors.quantity?.message}
          {...register('quantity')}
        />
        <Input
          label="Unit Price"
          type="number"
          step="0.01"
          required
          error={errors.unitPrice?.message}
          {...register('unitPrice')}
        />

        <Select
          label="Workflow"
          required
          error={errors.workflowTemplateId?.message}
          options={[
            { label: 'Select workflow', value: '' },
            ...workflowTemplatesMockData.map((t) => ({ label: t.templateName, value: t.id })),
          ]}
          {...register('workflowTemplateId')}
        />
        <Select
          label="Priority"
          required
          error={errors.priority?.message}
          options={[
            { label: 'Low', value: 'Low' },
            { label: 'Medium', value: 'Medium' },
            { label: 'High', value: 'High' },
          ]}
          {...register('priority')}
        />

        <div className="col-span-2">
          <Input
            label="Delivery Date"
            type="date"
            required
            error={errors.deliveryDate?.message}
            {...register('deliveryDate')}
          />
        </div>
      </form>
    </Modal>
  );
}