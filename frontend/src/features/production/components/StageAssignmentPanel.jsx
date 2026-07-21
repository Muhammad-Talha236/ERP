import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useStageAssignments } from '../hooks/useStageAssignments';
import { useAddStageAssignment } from '../hooks/useAddStageAssignment';
import { useCompleteStageAssignment } from '../hooks/useCompleteStageAssignment';
import { useUpdateOrderWorkflowStep } from '../hooks/useUpdateOrderWorkflowStep';
import { employeesMockData } from '@/mocks/data/employees.mock';
import { useState } from 'react';

/**
 * StageAssignmentPanel — shows every employee individually assigned
 * to ONE step, each with their own "mark my work done" action.
 *
 * Core rule: the step itself only becomes "Completed" once EVERY
 * assignment under it is done. This component checks that condition
 * after each individual completion and, if satisfied, updates the
 * parent OrderWorkflowStep's status — which is what then lets
 * OrderDetailModal's deriveOrderProgress() advance the whole order.
 *
 * @param {Object} props
 * @param {OrderWorkflowStep} props.step - the step this panel belongs to
 * @param {() => void} props.onStepCompleted - called when the LAST
 *        assignment finishes, so the parent can refresh order-level progress
 */
export function StageAssignmentPanel({ step, onStepCompleted }) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const { data: assignments, isLoading } = useStageAssignments(step.id);
  const { mutate: addAssignment, isPending: isAdding } = useAddStageAssignment();
  const { mutate: completeAssignment } = useCompleteStageAssignment();
  const { mutate: updateStep } = useUpdateOrderWorkflowStep();

  const allDone = useMemo(
    () => assignments && assignments.length > 0 && assignments.every((a) => a.isDone),
    [assignments]
  );

  const handleAddPerson = () => {
    if (!selectedEmployeeId) return;
    const employee = employeesMockData.find((e) => e.id === selectedEmployeeId);
    addAssignment({
      stepId: step.id,
      employeeId: selectedEmployeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
    });
    setSelectedEmployeeId('');
  };

  const handleMarkDone = (assignmentId) => {
    completeAssignment(assignmentId, {
      onSuccess: () => {
        // Re-check: were THIS the last one remaining?
        const updatedAssignments = assignments.map((a) =>
          a.id === assignmentId ? { ...a, isDone: true } : a
        );
        const nowAllDone = updatedAssignments.every((a) => a.isDone);

        if (nowAllDone) {
          // Every assigned employee is done — advance the step itself.
          updateStep(
            { stepId: step.id, updates: { status: 'Completed' } },
            { onSuccess: () => onStepCompleted() }
          );
        }
      },
    });
  };

  if (isLoading) return <p className="text-sm text-text-secondary">Loading assignments...</p>;

  return (
    <div className="space-y-3">
      {(!assignments || assignments.length === 0) && (
        <p className="text-sm text-text-secondary italic">No one assigned to this stage yet.</p>
      )}

      {assignments?.map((assignment) => (
        <div
          key={assignment.id}
          className="flex items-center justify-between rounded-input border border-border px-3 py-2"
        >
          <span className="text-sm text-text-primary">{assignment.employeeName}</span>
          {assignment.isDone ? (
            <span className="flex items-center gap-1 text-xs text-success font-medium">
              <CheckCircle2 size={14} /> Done
            </span>
          ) : (
            <button
              onClick={() => handleMarkDone(assignment.id)}
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-success transition-colors"
            >
              <Circle size={14} /> Mark my work done
            </button>
          )}
        </div>
      ))}

      {!allDone && (
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
      )}
    </div>
  );
}

StageAssignmentPanel.propTypes = {
  step: PropTypes.object.isRequired,
  onStepCompleted: PropTypes.func.isRequired,
};