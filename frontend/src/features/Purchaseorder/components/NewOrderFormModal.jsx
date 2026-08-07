import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CustomStageBuilder } from './CustomStageBuilder';
import { newOrderSchema } from '../schemas/newOrder.schema';
import { useCreateProductionOrder } from '../hooks/useCreateProductionOrder';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { api } from '@/services/api';

// Inline live workflows hook with a fallback safe array
function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      try {
        const response = await api.get('/workflows');
        return response.data?.data || response.data || response || [];
      } catch (error) {
        console.error("Failed to fetch workflows, using defaults", error);
        return [];
      }
    },
  });
}

const defaultValues = {
  customerName: '',
  productName: '',
  quantity: 0,
  unitPrice: 0,
  workflowMode: 'existing',
  workflowTemplateId: '',
  customStages: [{ position: 1, stageName: '', headcount: 1, wagePerPerson: 0, stageExpense: 0, assignedEmployeeId: '' }],
  priority: 'Medium',
  deliveryDate: '',
};

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
  const watchCustomStages = watch('customStages');

  const { data: employees = [] } = useEmployees();
  const { data: workflows = [], refetch: refetchWorkflows } = useWorkflows();
  const { mutate: createOrder, isPending } = useCreateProductionOrder();

  // Database se aane wale workflows ko options mein map karna
  const workflowOptions = Array.isArray(workflows) && workflows.length > 0 
    ? workflows.map((w) => ({ label: w.templateName || w.template_name || w.name, value: w.id }))
    : [
        { label: 'Standard Garments Production', value: 'standard-garments' },
        { label: 'Polo Shirt Manufacturing', value: 'polo-shirt' },
        { label: 'Basic Assembly Line', value: 'basic-assembly' },
      ];

  // Naya feature: Custom stages ko reusable template ke taur par save karne ke liye
  const handleSaveAsTemplate = async () => {
    try {
      const templateName = window.prompt("Enter a name for this workflow template:");
      if (!templateName) return;

      const payload = {
        templateName: templateName,
        stages: watchCustomStages.map((stage, index) => ({
          stageName: stage.stageName,
          expense: Number(stage.stageExpense || 0),
          wagePerPerson: Number(stage.wagePerPerson || 0),
          headcount: Number(stage.headcount || 1),
          position: Number(stage.position || index + 1)
        }))
      };

      const response = await api.post('/workflows', payload);
      if (response.data?.success || response.success) {
        alert("Workflow template saved successfully!");
        refetchWorkflows(); // Dropdown list ko refresh karne ke liye
      }
    } catch (error) {
      console.error("Failed to save workflow template:", error);
      alert("Error saving workflow template.");
    }
  };

  const onSubmit = (formData) => {
    const payload = {
      product_name: formData.productName,
      quantity: Number(formData.quantity),
      unit_price: Number(formData.unitPrice),
      customer_name: formData.customerName,
      priority: formData.priority,
      delivery_date: formData.deliveryDate,
      status: 'Pending',
      po_number: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      tenant_id: 1,
      current_stage_order: 1,
      received_date: new Date().toISOString().split('T')[0],
      workflow_mode: formData.workflowMode,
    };

    if (formData.workflowMode === 'existing') {
      payload.workflow_template_id = formData.workflowTemplateId;
      payload.custom_stages = [];
    } else {
      payload.workflow_template_id = null;
      payload.custom_stages = formData.customStages;
    }

    createOrder(payload, {
      onSuccess: () => {
        reset(defaultValues);
        onOpenChange(false);
      },
      onError: (err) => {
        console.error("Order creation failed on API:", err);
      },
    });
  };

  const onError = (formErrors) => {
    console.error("Form Validation Failed Errors:", formErrors);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New Production Order"
      description="Submit a client requirement to start production."
      size="lg"
      footer={
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
          Cancel
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Customer Name"
            required
            placeholder="e.g. Nike Pakistan"
            error={errors.customerName?.message}
            {...register('customerName')}
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
            min="0" 
            required 
            error={errors.quantity?.message} 
            {...register('quantity')} 
          />
          <Input 
            label="Unit Price" 
            type="number" 
            min="0" 
            step="0.01" 
            required 
            error={errors.unitPrice?.message} 
            {...register('unitPrice')} 
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
          <Input label="Delivery Date" type="date" required error={errors.deliveryDate?.message} {...register('deliveryDate')} />
        </div>

        {/* --- Workflow mode toggle --- */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-primary">Workflow</p>
            {workflowMode === 'custom' && (
              <Button type="button" variant="outline" size="sm" onClick={handleSaveAsTemplate}>
                Save as Template
              </Button>
            )}
          </div>
          
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
                { label: 'Select workflow template', value: '' },
                ...workflowOptions,
              ]}
              {...register('workflowTemplateId')}
            />
          ) : (
            <CustomStageBuilder 
              fields={fields} 
              register={register} 
              append={append} 
              remove={remove} 
              errors={errors} 
              employees={employees}
            />
          )}
        </div>

        {/* --- Submit Button Inside Form --- */}
        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
