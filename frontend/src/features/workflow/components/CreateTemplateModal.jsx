import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CustomStageBuilder } from '@/features/Purchaseorder/components/CustomStageBuilder';
import { useEmployees } from '../hooks/useEmployees';
import { createTemplateSchema } from '../schemas/createTemplate.schema';
import { useCreateWorkflowTemplate } from '../hooks/useCreateWorkflowTemplate';
import { useUpdateWorkflowTemplate } from '../hooks/useUpdateWorkflowTemplate';

const emptyDefaults = {
  templateName: '',
  customStages: [{ position: 1, stageName: '', headcount: 1, wagePerPerson: 0, stageExpense: 0, assignedEmployeeId: '' }],
};

/**
 * CreateTemplateModal — creates a new workflow template, or edits an
 * existing one when a `template` prop is passed.
 */
export function CreateTemplateModal({ open, onOpenChange, template = null }) {
  const isEditMode = Boolean(template);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: emptyDefaults,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'customStages' });
  const { data: employees = [] } = useEmployees();
  const { mutate: createTemplate, isPending: isCreating } = useCreateWorkflowTemplate();
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateWorkflowTemplate();
  const isPending = isCreating || isUpdating;

  // Jab edit ke liye template pass ho, form ko us data se pre-fill karein
  useEffect(() => {
    if (open && template) {
      reset({
        templateName: template.templateName || '',
        customStages: (template.stages ?? [])
          .filter((s) => s.stageName)
          .map((s, index) => ({
            position: s.position ?? index + 1,
            stageName: s.stageName || '',
            headcount: s.headcount ?? 1,
            wagePerPerson: s.wagePerPerson ?? 0,
            stageExpense: s.stageExpense ?? 0,
            assignedEmployeeId: '',
          })),
      });
    } else if (open && !template) {
      reset(emptyDefaults);
    }
  }, [open, template, reset]);

  const onSubmit = (formData) => {
    const handleError = (err) => {
      const message = err?.response?.data?.message || err?.message || 'Something went wrong.';
      // Duplicate name error ko form field ke neeche dikhayein
      if (message.toLowerCase().includes('already exists')) {
        setError('templateName', { type: 'manual', message });
      } else {
        console.error('Failed to save workflow template:', err);
      }
    };

    if (isEditMode) {
      updateTemplate(
        { id: template.id, templateName: formData.templateName, stages: formData.customStages },
        {
          onSuccess: () => {
            reset(emptyDefaults);
            onOpenChange(false);
          },
          onError: handleError,
        }
      );
    } else {
      createTemplate(
        { templateName: formData.templateName, stages: formData.customStages },
        {
          onSuccess: () => {
            reset(emptyDefaults);
            onOpenChange(false);
          },
          onError: handleError,
        }
      );
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? `Edit Template — ${template?.templateName}` : 'Create Workflow Template'}
      description="Define a reusable set of stages (e.g. Dying, Stitching) with headcount, wages, and expenses."
      size="lg"
      footer={
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
          Cancel
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Template Name"
          required
          placeholder="e.g. Polo Shirt Manufacturing"
          error={errors.templateName?.message}
          {...register('templateName')}
        />

        <CustomStageBuilder
          fields={fields}
          register={register}
          append={append}
          remove={remove}
          errors={errors}
          employees={employees}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}