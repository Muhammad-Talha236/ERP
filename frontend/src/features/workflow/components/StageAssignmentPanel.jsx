import { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useStageAssignments } from '../hooks/useStageAssignments';
import { useAddStageAssignment } from '../hooks/useAddStageAssignment';
import { useCompleteStageAssignment } from '../hooks/useCompleteStageAssignment';
import { useBundleStageAssignments } from '../hooks/useBundleStageAssignments';
import { useAddBundleStageAssignment } from '../hooks/useAddBundleStageAssignment';
import { useCompleteBundleStageAssignment } from '../hooks/useCompleteBundleStageAssignment';
import { useUpdateOrderWorkflowStep } from '../hooks/useUpdateOrderWorkflowStep';
import { employeesMockData } from '@/mocks/data/employees.mock';

/**
 * StageAssignmentPanel — shows every employee assigned to ONE stage,
 * each with their own "mark my work done" action.
 *
 * Now works in TWO scopes:
 *  - scope="order" (default): assignments belong to the ORDER's
 *    shared step (original behavior — one team works the stage for
 *    the whole order at once).
 *  - scope="bundle": assignments belong to ONE SPECIFIC BUNDLE's
 *    copy of this stage — completely separate from any other
 *    bundle's progress on the same stage name.
 *
 * @param {Object} props
 * @param {OrderWorkflowStep} props.step
 * @param {() => void} props.onStepCompleted
 * @param {'order'|'bundle'} [props.scope]
 * @param {string} [props.bundleId] - required when scope="bundle"
 */
export function StageAssignmentPanel({ step, onStepCompleted, scope = 'order', bundleId = null,canMarkDone = true }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  // Both hook sets are always called (rules of hooks), but only the
  // relevant one is actually enabled/used based on `scope`.
  const orderAssignmentsQuery = useStageAssignments(scope === 'order' ? step.id : null);
  const bundleAssignmentsQuery = useBundleStageAssignments(scope === 'bundle' ? bundleId : null);

  const { mutate: addOrderAssignment, isPending: isAddingOrder } = useAddStageAssignment();
  const { mutate: addBundleAssignment, isPending: isAddingBundle } = useAddBundleStageAssignment();
  const { mutate: completeOrderAssignment } = useCompleteStageAssignment();
  const { mutate: completeBundleAssignment } = useCompleteBundleStageAssignment();
  const { mutate: updateStep } = useUpdateOrderWorkflowStep();

  const isLoading = scope === 'order' ? orderAssignmentsQuery.isLoading : bundleAssignmentsQuery.isLoading;
  const isAdding = scope === 'order' ? isAddingOrder : isAddingBundle;

  // For bundle scope, filter down to just THIS step's assignments —
  // the bundle-level query returns assignments across all its stages.
  const assignments =
    scope === 'order'
      ? orderAssignmentsQuery.data
      : (bundleAssignmentsQuery.data ?? []).filter((a) => a.stepId === step.id);

  const handleAddPerson = () => {
    if (!selectedEmployeeId) return;
    const employee = employeesMockData.find((e) => e.id === selectedEmployeeId);
    const employeeName = `${employee.firstName} ${employee.lastName}`;

    if (scope === 'order') {
      addOrderAssignment({ stepId: step.id, employeeId: selectedEmployeeId, employeeName });
    } else {
      addBundleAssignment({
        bundleId,
        stepId: step.id,
        stageOrder: step.stageOrder,
        stageName: step.stageName,
        employeeId: selectedEmployeeId,
        employeeName,
      });
    }
    setSelectedEmployeeId('');
  };

  const handleMarkDone = (assignmentId) => {
    const finishUp = () => {
      const updated = assignments.map((a) => (a.id === assignmentId ? { ...a, isDone: true } : a));
      const nowAllDone = updated.every((a) => a.isDone);
      if (nowAllDone) onStepCompleted();
    };

    if (scope === 'order') {
      completeOrderAssignment(assignmentId, {
        onSuccess: () => {
          const updated = assignments.map((a) => (a.id === assignmentId ? { ...a, isDone: true } : a));
          const nowAllDone = updated.every((a) => a.isDone);
          if (nowAllDone) {
            updateStep({ stepId: step.id, updates: { status: 'Completed' } }, { onSuccess: () => onStepCompleted() });
          }
        },
      });
    } else {
      completeBundleAssignment(
        { assignmentId, wagePerPerson: step.wagePerPerson },
        { onSuccess: finishUp }
      );
    }
  };

  if (isLoading) return <p className="text-sm text-text-secondary">Loading assignments...</p>;

  return (
    <div className="space-y-3">
      {(!assignments || assignments.length === 0) && (
        <p className="text-sm text-text-secondary italic">No one assigned to this stage yet.</p>
      )}

      {assignments?.map((assignment) => (
        <div key={assignment.id} className="flex items-center justify-between rounded-input border border-border px-3 py-2">
          <span className="text-sm text-text-primary">{assignment.employeeName}</span>
          {assignment.isDone ? (
  <span className="flex items-center gap-1 text-xs text-success font-medium">
    <CheckCircle2 size={14} /> Done
  </span>
) : canMarkDone ? (
  <button onClick={() => handleMarkDone(assignment.id)} >
    <Circle size={14} /> Mark my work done
  </button>
) : (
  <span className="text-xs text-text-secondary italic">Assigned — waiting</span>
)}
        </div>
      ))}

      <div className="flex items-center gap-2 pt-2">
        <Select
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          className="flex-1 h-9"
          options={[
            { label: 'Add employee to this stage...', value: '' },
            ...employeesMockData.map((e) => ({ label: `${e.firstName} ${e.lastName}`, value: e.id })),
          ]}
        />
        <Button size="sm" onClick={handleAddPerson} disabled={!selectedEmployeeId || isAdding}>
          Add
        </Button>
      </div>
    </div>
  );
}

StageAssignmentPanel.propTypes = {
  step: PropTypes.object.isRequired,
  onStepCompleted: PropTypes.func.isRequired,
  scope: PropTypes.oneOf(['order', 'bundle']),
  bundleId: PropTypes.string,
  canMarkDone: PropTypes.bool,
};