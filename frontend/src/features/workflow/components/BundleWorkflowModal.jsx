import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { useBundleStageAssignments } from '../hooks/useBundleStageAssignments';
import { useAdvanceBundleStage } from '../hooks/useAdvanceBundleStage';
import { StageAssignmentPanel } from './StageAssignmentPanel';

/**
 * BundleWorkflowModal — Stage-by-stage workflow table for a specific bundle.
 */
export function BundleWorkflowModal({ bundle, steps = [] }) {
  const [expandedStepId, setExpandedStepId] = useState(null);

  const { data: assignments = [] } = useBundleStageAssignments(bundle?.id);
  const { mutate: advanceStage } = useAdvanceBundleStage();

  // 1. Unified order/position sorting logic (handles stageOrder or position)
  const sortedSteps = useMemo(() => {
    if (!Array.isArray(steps)) return [];
    return [...steps].sort((a, b) => {
      const posA = Number(a.stageOrder ?? a.position ?? 0);
      const posB = Number(b.stageOrder ?? b.position ?? 0);
      return posA - posB;
    });
  }, [steps]);

  // 2. Stage completion & lock status determination
  const stageStatuses = useMemo(() => {
    let previousComplete = true;
    return sortedSteps.map((step) => {
      // Safe matching for both IDs, step names, and stage names
      const stepAssignments = assignments.filter((a) => {
        const matchStepId = String(a.stepId || a.step_id || '') === String(step.id || '');
        
        const stepNameVal = String(step.stageName || step.stage_name || '').trim().toLowerCase();
        const assignmentStageName = String(a.stageName || a.stage_name || '').trim().toLowerCase();
        const matchStageName = stepNameVal && assignmentStageName && (stepNameVal === assignmentStageName);

        return matchStepId || matchStageName;
      });
      
      // Stage complete handling
      const isComplete = step.status === 'Completed' || 
        (stepAssignments.length > 0 && stepAssignments.every((a) => a.isDone || a.status === 'Completed'));
      
      const isLocked = !previousComplete;
      previousComplete = isComplete;

      return { step, isComplete, isLocked, assignments: stepAssignments };
    });
  }, [sortedSteps, assignments]);

  const activeIndex = stageStatuses.findIndex((s) => !s.isComplete && !s.isLocked);

  if (!bundle) return null;

  const handleStepCompleted = (stepIndex) => {
    const step = sortedSteps[stepIndex];
    const nextStep = sortedSteps[stepIndex + 1];

    advanceStage({
      bundleId: bundle.id || bundle.bundleNumber,
      currentStepId: step.id,
      nextStageOrder: nextStep ? (nextStep.stageOrder ?? nextStep.position) : (step.stageOrder ?? step.position),
      nextStageName: nextStep ? (nextStep.stageName || nextStep.stage_name) : (step.stageName || step.stage_name),
      isLastStage: !nextStep,
    }, {
      onSuccess: () => {
        setExpandedStepId(null);
      }
    });
  };

  return (
    <div className="overflow-x-auto rounded-input border border-border">
      <table className="w-full min-w-160">
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
                key={step.id || index}
                step={step}
                isActive={isActive}
                isLocked={isLocked}
                isComplete={isComplete}
                isExpanded={isExpanded}
                onToggleExpand={() => setExpandedStepId(isExpanded ? null : step.id)}
                bundleId={bundle.id || bundle.bundleNumber}
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
  const expenseVal = Number(step.expense || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const wageVal = Number(step.wagePerPerson ?? step.wage_per_person ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const headcountVal = Number(step.headcount || 1);

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
            {step.stageName || step.stage_name}
          </div>
        </td>
        <td className="py-2 px-3 text-sm text-text-secondary whitespace-nowrap">${expenseVal}</td>
        <td className="py-2 px-3 text-sm text-text-secondary whitespace-nowrap">${wageVal}</td>
        <td className="py-2 px-3 text-sm text-text-secondary">{headcountVal}</td>
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

BundleStepRow.propTypes = {
  step: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  isLocked: PropTypes.bool,
  isComplete: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onToggleExpand: PropTypes.func.isRequired,
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onStepCompleted: PropTypes.func.isRequired,
};

BundleWorkflowModal.propTypes = {
  bundle: PropTypes.object,
  steps: PropTypes.array,
};