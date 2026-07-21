import { useState } from 'react';
import { Pencil, Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useUpdateOrderWorkflowStep } from '../hooks/useUpdateOrderWorkflowStep';
import { useUpdateProductionOrderStage } from '../hooks/useUpdateProductionOrderStage';
import { deriveOrderProgress } from '../utils/deriveOrderProgress';
import { StageAssignmentPanel } from './StageAssignmentPanel';
import { QualityCheckPanel } from './QualityCheckPanel';

/**
 * OrderStepsTable — this order's own editable workflow steps.
 *
 * Only the CURRENTLY ACTIVE stage (first not-Completed, in order)
 * can expand. What it expands INTO depends on the stage:
 *  - "Quality Check" -> QualityCheckPanel (admin Approve/Reject)
 *  - anything else -> StageAssignmentPanel (each assigned employee
 *    marks their own portion done; stage auto-completes once all are done)
 *
 * @param {Object} props
 * @param {OrderWorkflowStep[]} props.steps
 * @param {ProductionOrder} props.order
 */
export function OrderStepsTable({ steps, order }) {
  const [expandedStepId, setExpandedStepId] = useState(null);
  const { mutate: updateStep } = useUpdateOrderWorkflowStep();
  const { mutate: updateOrderStage } = useUpdateProductionOrderStage();

  const sortedSteps = [...steps].sort((a, b) => a.stageOrder - b.stageOrder);
  const activeStep = sortedSteps.find((s) => s.status !== 'Completed');

  const recomputeOrderProgress = (updatedSteps) => {
    const progress = deriveOrderProgress(updatedSteps);
    if (progress.status !== order.status || progress.currentStageOrder !== order.currentStageOrder) {
      updateOrderStage({ id: order.id, ...progress });
    }
    setExpandedStepId(null);
  };

  const handleStepCompleted = (stepId) => {
    recomputeOrderProgress(sortedSteps.map((s) => (s.id === stepId ? { ...s, status: 'Completed' } : s)));
  };

  // Rejection: the QC step goes back to 'In Progress' — order progress
  // is recomputed the same way, which will correctly show 'In Progress'
  // again since the QC step is no longer 'Completed'.
  const handleQCRejected = (stepId) => {
    recomputeOrderProgress(sortedSteps.map((s) => (s.id === stepId ? { ...s, status: 'In Progress' } : s)));
  };

  return (
    <div className="overflow-x-auto rounded-input border border-border">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-border bg-surface/50">
            {['STAGE', 'EXPENSE', 'WAGE/UNIT', 'HEADCOUNT', 'STATUS', ''].map((col) => (
              <th key={col} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-2 px-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedSteps.map((step) => {
            const isActive = step.id === activeStep?.id;
            const isCompleted = step.status === 'Completed';
            const isFuture = !isActive && !isCompleted;
            const isQC = step.stageName === 'Quality Check';

            return (
              <StepRow
                key={step.id}
                step={step}
                isActive={isActive}
                isFuture={isFuture}
                isQC={isQC}
                isExpanded={expandedStepId === step.id}
                onToggleExpand={() => setExpandedStepId(expandedStepId === step.id ? null : step.id)}
                onStepCompleted={() => handleStepCompleted(step.id)}
                onQCRejected={() => handleQCRejected(step.id)}
                updateStep={updateStep}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StepRow({ step, isActive, isFuture, isQC, isExpanded, onToggleExpand, onStepCompleted, onQCRejected, updateStep }) {
  const [isEditing, setIsEditing] = useState(false);
  const [expense, setExpense] = useState(step.expense);
  const [wagePerUnit, setWagePerUnit] = useState(step.wagePerUnit);
  const [headcount, setHeadcount] = useState(step.headcount);

  const isCompleted = step.status === 'Completed';

  const handleSave = () => {
    updateStep({
      stepId: step.id,
      updates: { expense: Number(expense), wagePerUnit: Number(wagePerUnit), headcount: Number(headcount) },
    }, { onSuccess: () => setIsEditing(false) });
  };

  const handleCancel = () => {
    setExpense(step.expense);
    setWagePerUnit(step.wagePerUnit);
    setHeadcount(step.headcount);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr className="border-b border-border last:border-0 bg-primary/5">
        <td className="py-2 px-3 text-sm font-medium text-text-primary whitespace-nowrap">{step.stageName}</td>
        <td className="py-2 px-3"><Input type="number" value={expense} onChange={(e) => setExpense(e.target.value)} className="w-24 h-8" /></td>
        <td className="py-2 px-3"><Input type="number" step="0.01" value={wagePerUnit} onChange={(e) => setWagePerUnit(e.target.value)} className="w-24 h-8" /></td>
        <td className="py-2 px-3"><Input type="number" value={headcount} onChange={(e) => setHeadcount(e.target.value)} className="w-20 h-8" /></td>
        <td className="py-2 px-3"><Badge variant="neutral">{step.status}</Badge></td>
        <td className="py-2 px-3 text-right whitespace-nowrap">
          <button onClick={handleCancel} className="text-text-secondary hover:text-text-primary mr-3"><X size={16} /></button>
          <button onClick={handleSave} className="text-primary hover:text-primary-hover"><Check size={16} /></button>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr
        className={`border-b border-border last:border-0 ${isFuture ? 'opacity-40' : ''} ${isActive ? 'cursor-pointer hover:bg-surface/40' : ''}`}
        onClick={isActive ? onToggleExpand : undefined}
      >
        <td className="py-2 px-3 text-sm font-medium text-text-primary whitespace-nowrap">
          <div className="flex items-center gap-1">
            {isActive && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            {step.stageName}
          </div>
        </td>
        <td className="py-2 px-3 text-sm text-text-secondary whitespace-nowrap">${step.expense.toLocaleString()}</td>
        <td className="py-2 px-3 text-sm text-text-secondary whitespace-nowrap">${step.wagePerUnit}</td>
        <td className="py-2 px-3 text-sm text-text-secondary">{step.headcount}</td>
        <td className="py-2 px-3">
          <Badge variant={isCompleted ? 'success' : isActive ? (isQC ? 'warning' : 'info') : 'neutral'}>
            {step.status}
          </Badge>
        </td>
        <td className="py-2 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          {!isFuture && (
            <button onClick={() => setIsEditing(true)} className="text-text-secondary hover:text-primary transition-colors">
              <Pencil size={16} />
            </button>
          )}
        </td>
      </tr>

      {isActive && isExpanded && (
        <tr className="border-b border-border last:border-0 bg-surface/20">
          <td colSpan={6} className="px-3 py-3">
            {isQC ? (
              <QualityCheckPanel step={step} onApproved={onStepCompleted} onRejected={onQCRejected} />
            ) : (
              <StageAssignmentPanel step={step} onStepCompleted={onStepCompleted} />
            )}
          </td>
        </tr>
      )}
    </>
  );
}

OrderStepsTable.propTypes = {
  steps: PropTypes.array.isRequired,
  order: PropTypes.object.isRequired,
};