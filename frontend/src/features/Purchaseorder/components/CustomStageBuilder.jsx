import { Plus, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

/**
 * CustomStageBuilder — lets the user build a one-off workflow for
 * THIS order only, without picking an existing template.
 */
export function CustomStageBuilder({ fields, register, append, remove, errors, employees = [] }) {
  const handleAddStage = () => {
    append({
      position: fields.length + 1,
      stageName: '',
      headcount: 1,
      wagePerPerson: 0,
      stageExpense: 0,
      assignedEmployeeId: '',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-text-primary">Custom Workflow Stages</p>
        <Button type="button" variant="ghost" size="sm" onClick={handleAddStage}>
          <Plus size={14} /> Add Stage
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-input border border-border p-3">
            <div className="grid grid-cols-[70px_1fr_auto] gap-2 items-start">
              <Input
                type="number"
                min="1"
                label="Position"
                placeholder="1"
                error={errors?.customStages?.[index]?.position?.message}
                {...register(`customStages.${index}.position`)}
              />
              <Input
                label="Stage Name"
                placeholder="e.g. Cutting"
                error={errors?.customStages?.[index]?.stageName?.message}
                {...register(`customStages.${index}.stageName`)}
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

            {/* Employee Assignment Dropdown with Fallbacks */}
            <div className="mt-2">
              <Select
                label="Assigned Employee"
                error={errors?.customStages?.[index]?.assignedEmployeeId?.message}
                options={[
                  { label: 'Select Employee (Optional)', value: '' },
                  ...employees.map((emp) => ({ 
                    label: emp.name || emp.fullName || emp.firstName || emp.username || 'Unnamed Employee', 
                    value: emp.id || emp._id 
                  })),
                ]}
                {...register(`customStages.${index}.assignedEmployeeId`)}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <Input
                type="number"
                min="0"
                label="Headcount"
                error={errors?.customStages?.[index]?.headcount?.message}
                {...register(`customStages.${index}.headcount`)}
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                label="Wage per Person"
                error={errors?.customStages?.[index]?.wagePerPerson?.message}
                {...register(`customStages.${index}.wagePerPerson`)}
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                label="Stage Expense"
                error={errors?.customStages?.[index]?.stageExpense?.message}
                {...register(`customStages.${index}.stageExpense`)}
              />
            </div>
          </div>
        ))}
      </div>

      {errors?.customStages?.message && (
        <p className="text-xs text-danger mt-2">{errors.customStages.message}</p>
      )}

      <p className="text-xs text-text-secondary mt-2">
        Stages run in order of their Position number (lowest first) — change a stage's
        position to reorder it.
      </p>
    </div>
  );
}

CustomStageBuilder.propTypes = {
  fields: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  append: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  errors: PropTypes.object,
  employees: PropTypes.array,
};