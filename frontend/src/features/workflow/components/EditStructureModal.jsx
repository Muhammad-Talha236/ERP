import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { editStructureSchema } from '../schemas/editStructure.schema';
import { useReplaceOrderWorkflowStructure } from '../hooks/useReplaceOrderWorkflowStructure';

/**
 * EditStructureModal — add/remove/rename/reposition an order's
 * workflow stages. Only ever opened when the order hasn't started
 * (all steps "Not Started") — the "Edit Structure" button that
 * triggers this is itself only shown under that condition.
 *
 * Reordering is position-number based (same as the New Order form's
 * custom builder) — no drag-and-drop.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.orderId
 * @param {OrderWorkflowStep[]} props.steps - current steps, to pre-fill the form
 */
export function EditStructureModal({ open, onOpenChange, orderId, steps }) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(editStructureSchema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'steps' });
  const { mutate: replaceStructure, isPending } = useReplaceOrderWorkflowStructure();

  useEffect(() => {
    if (open) {
      reset({
        steps: [...steps]
          .sort((a, b) => a.stageOrder - b.stageOrder)
          .map((s) => ({
            id: s.id,
            position: s.stageOrder,
            stageName: s.stageName,
            headcount: s.headcount,
            wagePerPerson: s.wagePerPerson,
            expense: s.expense,
          })),
      });
    }
  }, [open, steps, reset]);

  const onSubmit = (formData) => {
    replaceStructure({ orderId, steps: formData.steps }, { onSuccess: () => onOpenChange(false) });
  };

  const handleAddStage = () => {
    append({ position: fields.length + 1, stageName: '', headcount: 1, wagePerPerson: 0, expense: 0 });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Workflow Structure"
      description="Add, remove, rename, or reorder stages for this order."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Structure'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">Stages</p>
          <Button type="button" variant="ghost" size="sm" onClick={handleAddStage}>
            <Plus size={14} /> Add Stage
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="rounded-input border border-border p-3">
            <div className="grid grid-cols-[70px_1fr_auto] gap-2 items-start">
              <Input
                type="number"
                label="Position"
                error={errors.steps?.[index]?.position?.message}
                {...register(`steps.${index}.position`)}
              />
              <Input
                label="Stage Name"
                error={errors.steps?.[index]?.stageName?.message}
                {...register(`steps.${index}.stageName`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="mt-6 text-text-secondary hover:text-danger disabled:opacity-30 disabled:hover:text-text-secondary"
                aria-label="Remove stage"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <Input type="number" label="Headcount" error={errors.steps?.[index]?.headcount?.message} {...register(`steps.${index}.headcount`)} />
              <Input type="number" step="0.01" label="Wage per Person" error={errors.steps?.[index]?.wagePerPerson?.message} {...register(`steps.${index}.wagePerPerson`)} />
              <Input type="number" step="0.01" label="Expense" error={errors.steps?.[index]?.expense?.message} {...register(`steps.${index}.expense`)} />
            </div>
          </div>
        ))}

        {errors.steps?.message && <p className="text-xs text-danger">{errors.steps.message}</p>}

        <p className="text-xs text-text-secondary">
          Stages run in order of their Position number (lowest first). Employee
          assignments, if any, will be cleared since the structure has changed.
        </p>
      </form>
    </Modal>
  );
}

EditStructureModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
};