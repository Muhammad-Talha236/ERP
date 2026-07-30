import { useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { useBundleStageAssignments } from '../hooks/useBundleStageAssignments';
import { useAdvanceBundleStage } from '../hooks/useAdvanceBundleStage';
import { StageAssignmentPanel } from './StageAssignmentPanel';

/**
 * BundleWorkflowModal — renders the SAME table layout as
 * OrderStepsTable (Stage / Expense / Wage-Person / Headcount /
 * Status), but tracks progress for ONE SPECIFIC BUNDLE — completely
 * independent from the order's shared step status and from every
 * other bundle in the same order.
 *
 * The "Back to bundles" navigation now lives in the parent
 * (OrderWorkflowCard), so this component is purely the table itself.
 *
 * @param {Object} props
 * @param {ProductionBundle} props.bundle
 * @param {OrderWorkflowStep[]} props.steps
 */
export function BundleWorkflowModal({ bundle, steps }) {
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
          {stageStatuses.map(({ step, isComplete, isLocked }, index) => (
            <BundleStepRow
              key={step.id}
              step={step}
              isActive={index === activeIndex}
              isLocked={isLocked}
              isComplete={isComplete}
              bundleId={bundle.id}
              onStepCompleted={() => handleStepCompleted(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BundleStepRow({ step, isActive, isLocked, isComplete, bundleId, onStepCompleted }) {
  return (
    <>
      <tr className={`border-b border-border last:border-0 ${isLocked ? 'opacity-40' : ''}`}>
        <td className="py-2 px-3 text-sm font-medium text-text-primary whitespace-nowrap">
          <div className="flex items-center gap-1">
            {isActive && <ChevronDown size={14} />}
            {!isActive && !isComplete && !isLocked && <ChevronRight size={14} />}
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

      {isActive && (
        <tr className="border-b border-border last:border-0 bg-surface/20">
          <td colSpan={5} className="px-3 py-3">
            <StageAssignmentPanel step={step} onStepCompleted={onStepCompleted} scope="bundle" bundleId={bundleId} />
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