import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CustomStageBuilder } from './CustomStageBuilder';
import { newOrderSchema } from '../schemas/newOrder.schema';
import { useCreateProductionOrder } from '../hooks/useCreateProductionOrder';
import { customersMockData } from '@/mocks/data/customers.mock';
import { workflowTemplatesMockData } from '@/mocks/data/workflowTemplates.mock';

const defaultValues = {
  customerId: '',
  productName: '',
  quantity: 0,
  unitPrice: 0,
  workflowMode: 'existing',
  workflowTemplateId: '',
  customStages: [{ position: 1, stageName: '', headcount: 1, wagePerPerson: 0, stageExpense: 0 }],
  priority: 'Medium',
  deliveryDate: '',
};

/**
 * NewOrderFormModal — "New Order" form (PO Flow Steps 1-3).
 *
 * NEW: workflowMode toggle lets the user choose between:
 *  - "existing": pick a saved workflow template (previous behavior)
 *  - "custom": build a one-off set of stages for THIS order only,
 *    using CustomStageBuilder (position-based add/remove/rename)
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function NewOrderFormModal({ open, onOpenChange }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newOrderSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'customStages' });
  const workflowMode = watch('workflowMode');

  const { mutate: createOrder, isPending } = useCreateProductionOrder();

  const onSubmit = (formData) => {
    const customer = customersMockData.find((c) => c.id === formData.customerId);

    const payload = {
      customerId: formData.customerId,
      customerName: customer.companyName,
      productName: formData.productName,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      priority: formData.priority,
      deliveryDate: formData.deliveryDate,
    };

    if (formData.workflowMode === 'existing') {
      payload.workflowTemplateId = formData.workflowTemplateId;
    } else {
      payload.customStages = formData.customStages;
    }

    createOrder(payload, {
      onSuccess: () => {
        reset(defaultValues);
        onOpenChange(false);
      },
    });
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
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

          <Input label="Quantity" type="number" required error={errors.quantity?.message} {...register('quantity')} />
          <Input label="Unit Price" type="number" step="0.01" required error={errors.unitPrice?.message} {...register('unitPrice')} />

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
          <Input label="Delivery Date" type="date" required error={errors.deliveryDate?.message} {...register('deliveryDate')} />
        </div>

        {/* --- Workflow mode toggle --- */}
        <div className="pt-2 border-t border-border">
          <p className="text-sm font-medium text-text-primary mb-2">Workflow</p>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="radio" value="existing" {...register('workflowMode')} />
              Use existing workflow
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="radio" value="custom" {...register('workflowMode')} />
              Build custom workflow
            </label>
          </div>

          {workflowMode === 'existing' ? (
            <Select
              label="Workflow Template"
              required
              error={errors.workflowTemplateId?.message}
              options={[
                { label: 'Select workflow', value: '' },
                ...workflowTemplatesMockData.map((t) => ({ label: t.templateName, value: t.id })),
              ]}
              {...register('workflowTemplateId')}
            />
          ) : (
            <CustomStageBuilder fields={fields} register={register} append={append} remove={remove} errors={errors} />
          )}
        </div>
      </form>
    </Modal>
  );
}