import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { useBundleStageAssignments } from '../hooks/useBundleStageAssignments';
import { useAdvanceBundleStage } from '../hooks/useAdvanceBundleStage';
import { StageAssignmentPanel } from './StageAssignmentPanel';

/**
 * BundleWorkflowModal — the stage-by-stage table for ONE SPECIFIC
 * BUNDLE.
 *
 * Every row can now be expanded (not just the current active one),
 * so employees can be pre-assigned to ANY stage in advance — no
 * separate "Bulk Assign" screen needed. Sequential rules are still
 * enforced inside StageAssignmentPanel: "Mark my work done" only
 * appears there for the bundle's actual current active stage;
 * assignments made to a future stage just wait as a visible plan
 * until their turn comes.
 */
export function BundleWorkflowModal({ bundle, steps }) {
  const [expandedStepId, setExpandedStepId] = useState(null);

  const { data: assignments } = useBundleStageAssignments(bundle?.id);
  const { mutate: advanceStage } = useAdvanceBundleStage();

  const sortedSteps = useMemo(() => [...steps].sort((a, b) => a.stageOrder - b.stageOrder), [steps]);

  const stageStatuses = useMemo(() => {
    let previousComplete = true;
    return sortedSteps.map((step) => {
      const stepAssignments = (assignments ?? []).filter((a) => a.stepId === step.id);
      const isComplete = stepAssignments.length > 0 && stepAssignments.every((a) => a.isDone);
      const isLocked = !previousComplete;
      previousComplete = isComplete;
      return { step, isComplete, isLocked };
    });
  }, [sortedSteps, assignments]);

  const activeIndex = stageStatuses.findIndex((s) => !s.isComplete && !s.isLocked);

  if (!bundle) return null;

  const handleStepCompleted = (stepIndex) => {
    const step = sortedSteps[stepIndex];
    const nextStep = sortedSteps[stepIndex + 1];
    advanceStage({
      bundleId: bundle.id,
      nextStageOrder: nextStep ? nextStep.stageOrder : step.stageOrder,
      nextStageName: nextStep ? nextStep.stageName : step.stageName,
      isLastStage: !nextStep,
    });
  };

  return (
    <div className="overflow-x-auto rounded-input border border-border">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-border bg-surface/50">
            {['STAGE', 'EXPENSE', 'WAGE/PERSON', 'HEADCOUNT', 'STATUS'].map((col) => (
              <th key={col} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-2 px-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stageStatuses.map(({ step, isComplete, isLocked }, index) => {
            const isActive = index === activeIndex;
            const isExpanded = expandedStepId === step.id;

            return (
              <BundleStepRow
                key={step.id}
                step={step}
                isActive={isActive}
                isLocked={isLocked}
                isComplete={isComplete}
                isExpanded={isExpanded}
                onToggleExpand={() => setExpandedStepId(isExpanded ? null : step.id)}
                bundleId={bundle.id}
                onStepCompleted={() => handleStepCompleted(index)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BundleStepRow({ step, isActive, isLocked, isComplete, isExpanded, onToggleExpand, bundleId, onStepCompleted }) {
  return (
    <>
      <tr
        className={`border-b border-border last:border-0 cursor-pointer hover:bg-surface/30 ${isLocked ? 'opacity-70' : ''}`}
        onClick={onToggleExpand}
      >
        <td className="py-2 px-3 text-sm font-medium text-text-primary whitespace-nowrap">
          <div className="flex items-center gap-1">
            {isComplete && <CheckCircle2 size={14} className="text-success" />}
            {!isComplete && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} className="text-text-secondary" />)}
            {step.stageName}
          </div>
        </td>
        <td className="py-2 px-3 text-sm text-text-secondary whitespace-nowrap">${step.expense.toLocaleString()}</td>
        <td className="py-2 px-3 text-sm text-text-secondary whitespace-nowrap">${step.wagePerPerson}</td>
        <td className="py-2 px-3 text-sm text-text-secondary">{step.headcount}</td>
        <td className="py-2 px-3">
          <Badge variant={isComplete ? 'success' : isActive ? 'info' : 'neutral'}>
            {isComplete ? 'Completed' : isActive ? 'In Progress' : isLocked ? 'Waiting' : 'Not Started'}
          </Badge>
        </td>
      </tr>

      {isExpanded && !isComplete && (
        <tr className="border-b border-border last:border-0 bg-surface/20" onClick={(e) => e.stopPropagation()}>
          <td colSpan={5} className="px-3 py-3">
            
            <StageAssignmentPanel
              step={step}
              onStepCompleted={onStepCompleted}
              scope="bundle"
              bundleId={bundleId}
              canMarkDone={isActive}
            />
          </td>
        </tr>
      )}
    </>
  );
}

BundleWorkflowModal.propTypes = {
  bundle: PropTypes.object,
  steps: PropTypes.array.isRequired,
};