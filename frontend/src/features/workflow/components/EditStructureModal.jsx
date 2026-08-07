import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, BookmarkPlus } from 'lucide-react';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useReplaceOrderWorkflowStructure } from '../hooks/useReplaceOrderWorkflowStructure';
import { get, post } from '../../../services/api';

export function EditStructureModal({ open, onOpenChange, orderId, steps }) {
  const [loadingStages, setLoadingStages] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const { register, control, reset, getValues } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'steps' });
  const { mutate: replaceStructure, isPending } = useReplaceOrderWorkflowStructure();

  useEffect(() => {
    const fetchLiveStages = async () => {
      if (!orderId) return;
      try {
        setLoadingStages(true);
        const response = await get(`/workflows/stages/${orderId}`);
        
        if (response && response.success && response.data && response.data.length > 0) {
          const formattedSteps = response.data.map((s) => ({
            id: s.id,
            position: Math.max(1, Number(s.position) || 1),
            stageName: s.stage_name || '',
            headcount: Math.max(1, Number(s.headcount) || 1),
            wagePerPerson: s.wage_per_person ?? s.wagePerPerson ?? 0,
            expense: Math.max(0, Number(s.expense) || 0),
          }));
          reset({ steps: formattedSteps });
        } else {
          fallbackToPropSteps();
        }
      } catch (err) {
        console.warn("Backend fetch failed, falling back to props:", err);
        fallbackToPropSteps();
      } finally {
        setLoadingStages(false);
      }
    };

    const fallbackToPropSteps = () => {
      if (steps && steps.length > 0) {
        reset({
          steps: [...steps]
            .sort((a, b) => (a.stageOrder || a.position) - (b.stageOrder || b.position))
            .map((s) => ({
              id: s.id,
              position: Math.max(1, Number(s.stageOrder || s.position || 1)),
              stageName: s.stageName || s.stage_name || '',
              headcount: Math.max(1, Number(s.headcount || 1)),
              wagePerPerson: s.wagePerPerson ?? s.wage_per_person ?? 0,
              expense: Math.max(0, Number(s.expense || 0)),
            })),
        });
      }
    };

    if (open) {
      fetchLiveStages();
    }
  }, [open, orderId, steps, reset]);

  const handleSaveAsTemplate = async () => {
    const templateName = window.prompt("Enter a name for this new workflow template:");
    if (!templateName) return;

    const formValues = getValues();
    const rawSteps = formValues.steps || [];

    const stagesPayload = rawSteps.map((s, index) => ({
      stageName: (s.stageName || '').trim() || `Stage ${index + 1}`,
      expense: Math.max(0, parseFloat(s.expense || 0)),
      wagePerPerson: Math.max(0, parseFloat(s.wagePerPerson || 0)),
      headcount: Math.max(1, parseInt(s.headcount || 1, 10)),
      position: parseInt(s.position || index + 1, 10),
    }));

    stagesPayload.sort((a, b) => a.position - b.position);

    try {
      setIsSavingTemplate(true);
      const response = await post('/workflows', {
        templateName: templateName,
        stages: stagesPayload,
      });

      if (response && (response.success || response.data)) {
        alert("Workflow template saved successfully!");
      } else {
        alert("Failed to save workflow template.");
      }
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Error: " + (err?.response?.data?.message || err.message));
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleSaveClick = () => {
    const formValues = getValues();
    const rawSteps = formValues.steps || [];
    const totalStages = rawSteps.length;

    const positions = [];
    const duplicatePositions = new Set();
    let outOfRangePosition = false;
    let invalidPositionValue = null;

    for (let i = 0; i < rawSteps.length; i++) {
      const pos = parseInt(rawSteps[i].position, 10);
      
      if (pos < 1 || pos > totalStages) {
        outOfRangePosition = true;
        invalidPositionValue = pos;
        break;
      }

      if (positions.includes(pos)) {
        duplicatePositions.add(pos);
      } else {
        positions.push(pos);
      }
    }

    if (outOfRangePosition) {
      alert(`Invalid position ${invalidPositionValue}! Position must be between 1 and ${totalStages} (total number of stages).`);
      return;
    }

    if (duplicatePositions.size > 0) {
      alert(`Duplicate positions detected! Position ${Array.from(duplicatePositions).join(', ')} is assigned to multiple stages. Each stage must have a unique position.`);
      return;
    }

    const stagesPayload = rawSteps.map((s, index) => ({
      position: parseInt(s.position || index + 1, 10),
      stage_name: (s.stageName || '').trim() || `Stage ${index + 1}`,
      headcount: Math.max(1, parseInt(s.headcount || 1, 10)),
      wage_per_person: Math.max(0, parseFloat(s.wagePerPerson || 0)),
      expense: Math.max(0, parseFloat(s.expense || 0)),
    }));

    stagesPayload.sort((a, b) => a.position - b.position);

    replaceStructure(
      { orderId, stages: stagesPayload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (err) => {
          console.error("Mutation Error Details:", err);
          const errorMsg = err?.response?.data?.message || err?.message || "Failed to update backend";
          alert("Save error: " + errorMsg);
        },
      }
    );
  };

  const handleAddStage = () => {
    append({
      position: fields.length + 1,
      stageName: '',
      headcount: 1,
      wagePerPerson: 0,
      expense: 0,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Workflow Structure"
      description={`Add, remove, rename, or reorder stages for ${orderId || 'Order'}.`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveAsTemplate} 
            disabled={isPending || loadingStages || isSavingTemplate || fields.length === 0}
          >
            <BookmarkPlus size={16} className="mr-1.5" />
            {isSavingTemplate ? 'Saving Template...' : 'Save as Template'}
          </Button>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending || loadingStages}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveClick} 
              disabled={isPending || loadingStages}
            >
              {isPending ? 'Saving...' : 'Save Structure'}
            </Button>
          </div>
        </div>
      }
    >
      {loadingStages ? (
        <div className="p-6 text-center text-sm text-text-secondary">
          Loading workflow stages from database...
        </div>
      ) : (
        <div className="space-y-3">
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
                  min="1"
                  max={fields.length}
                  label="Position"
                  {...register(`steps.${index}.position`)}
                />
                <Input
                  label="Stage Name"
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
                <Input
                  type="number"
                  min="1"
                  label="Headcount"
                  {...register(`steps.${index}.headcount`)}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  label="Wage per Person"
                  {...register(`steps.${index}.wagePerPerson`)}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  label="Expense"
                  {...register(`steps.${index}.expense`)}
                />
              </div>
            </div>
          ))}

          <p className="text-xs text-text-secondary">
            Stages run in order of their Position number (1 to {fields.length}). Each position must be unique.
          </p>
        </div>
      )}
    </Modal>
  );
}

EditStructureModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  steps: PropTypes.array.isRequired,
};