import { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useStageAssignments } from '../hooks/useStageAssignments';
import { useQueryClient } from '@tanstack/react-query';
import { useAddStageAssignment } from '../hooks/useAddStageAssignment';
import { useCompleteStageAssignment } from '../hooks/useCompleteStageAssignment';
import { useBundleStageAssignments } from '../hooks/useBundleStageAssignments';
import { useAddBundleStageAssignment } from '../hooks/useAddBundleStageAssignment';
import { useCompleteBundleStageAssignment } from '../hooks/useCompleteBundleStageAssignment';
import { useUpdateOrderWorkflowStep } from '../hooks/useUpdateOrderWorkflowStep';
import { useEmployees } from '../hooks/useEmployees';

/**
 * StageAssignmentPanel — shows every employee assigned to ONE stage,
 * each with their own "mark my work done" action.
 */
export function StageAssignmentPanel({
  step,
  onStepCompleted,
  scope = 'order',
  bundleId = null,
  canMarkDone = true
}) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const {
    data: rawEmployees = [],
    isLoading: isLoadingEmployees,
    isError: isEmployeesError,
    error: employeesError,
    refetch: refetchEmployees,
  } = useEmployees();

  const employees = Array.isArray(rawEmployees)
    ? rawEmployees
    : (rawEmployees.employees || rawEmployees.data || []);

  const orderAssignmentsQuery = useStageAssignments(scope === 'order' ? step?.id : null);
  const bundleAssignmentsQuery = useBundleStageAssignments(scope === 'bundle' ? bundleId : null);

  const { mutate: addOrderAssignment, isPending: isAddingOrder } = useAddStageAssignment();
  const { mutate: addBundleAssignment, isPending: isAddingBundle } = useAddBundleStageAssignment();
  const { mutate: completeOrderAssignment } = useCompleteStageAssignment();
  const { mutate: completeBundleAssignment } = useCompleteBundleStageAssignment();
  const { mutate: updateStep } = useUpdateOrderWorkflowStep();
  const queryClient = useQueryClient();

  const isLoadingAssignments = scope === 'order' ? orderAssignmentsQuery.isLoading : bundleAssignmentsQuery.isLoading;
  const isAdding = scope === 'order' ? isAddingOrder : isAddingBundle;

  const rawAssignments = scope === 'order'
    ? orderAssignmentsQuery.data
    : (bundleAssignmentsQuery.data ?? []).filter((a) => {
        const assignmentStepId = String(a.stepId || a.step_id || '').trim();
        const currentStepId = String(step.id || step.step_id || '').trim();

        const assignmentStageName = String(a.stageName || a.stage_name || '').trim().toLowerCase();
        const currentStageName = String(step.stageName || step.stage_name || step.name || '').trim().toLowerCase();

        if (!assignmentStepId && !assignmentStageName) return true;

        return (assignmentStepId && currentStepId && assignmentStepId === currentStepId) ||
               (assignmentStageName && currentStageName && assignmentStageName === currentStageName);
      });

  const assignments = rawAssignments || [];

  const handleAddPerson = () => {
    if (!selectedEmployeeId) return;

    const alreadyAssigned = assignments.some(
      (a) => String(a.employeeId || a.employee_id) === String(selectedEmployeeId)
    );

    if (alreadyAssigned) {
      alert('This employee is already assigned to this stage.');
      return;
    }

    const employee = employees.find((e) => String(e.id) === String(selectedEmployeeId));
    const employeeName = employee
      ? `${employee.firstName || employee.first_name || ''} ${employee.lastName || employee.last_name || ''}`.trim()
      : 'Assigned Worker';

    const stagePos = step.stageOrder ?? step.position ?? 1;
    const stageTitle = step.stageName ?? step.stage_name ?? step.name ?? '';
    const expenseVal = Number(step.expense || 0);
    const wageVal = Number(step.wagePerPerson ?? step.wage_per_person ?? step.wage ?? 0);
    const headcountVal = Number(step.headcount || 1);

    if (scope === 'order') {
      addOrderAssignment({
        stepId: step.id,
        employeeId: selectedEmployeeId,
        employeeName
      }, {
        onSuccess: () => setSelectedEmployeeId('')
      });
    } else {
      addBundleAssignment({
        bundleId,
        stepId: step.id,
        stageOrder: stagePos,
        stageName: stageTitle,
        employeeId: selectedEmployeeId,
        employeeName,
        expense: expenseVal,
        wagePerPerson: wageVal,
        headcount: headcountVal,
      }, {
        onSuccess: () => setSelectedEmployeeId('')
      });
    }
  };

  const handleMarkDone = (assignmentId) => {
    const finishUp = () => {
      const updated = assignments.map((a) => (a.id === assignmentId ? { ...a, isDone: true } : a));
      const nowAllDone = updated.length > 0 && updated.every((a) => a.isDone);
      if (nowAllDone) onStepCompleted();
    };

    const wage = Number(step.wagePerPerson ?? step.wage_per_person ?? step.wage ?? 0);

    if (scope === 'order') {
      completeOrderAssignment(assignmentId, {
        onSuccess: () => {
          const updated = assignments.map((a) => (a.id === assignmentId ? { ...a, isDone: true } : a));
          const nowAllDone = updated.length > 0 && updated.every((a) => a.isDone);
          if (nowAllDone) {
            updateStep({ stepId: step.id, updates: { status: 'Completed' } }, { onSuccess: () => onStepCompleted() });
          }
        },
      });
    } else {
      completeBundleAssignment(
        { assignmentId, wagePerPerson: wage, bundleId },
        {
          onSuccess: () => {
            finishUp();
            queryClient.invalidateQueries({ queryKey: ['bundle-assignments', bundleId] });
            queryClient.invalidateQueries({ queryKey: ['bundle-assignments'] });
          },
          onError: (error) => {
            window.alert(`Failed to complete assignment: ${error.message || error}`);
          },
        }
      );
    }
  };

  if (isLoadingAssignments || isLoadingEmployees) {
    return <p className="text-sm text-text-secondary py-2">Loading stage details...</p>;
  }

  if (isEmployeesError) {
    return (
      <div className="rounded-input border border-red-200 bg-red-50 px-3 py-2">
        <p className="text-sm text-red-600">
          Could not load employees: {employeesError?.message || 'Unknown error'}
        </p>
        <button
          type="button"
          onClick={() => refetchEmployees()}
          className="text-xs text-brand hover:text-brand-hover font-medium mt-1"
        >
          Retry
        </button>
      </div>
    );
  }

  const availableEmployees = employees.filter(
    (emp) => !assignments.some((a) => String(a.employeeId || a.employee_id) === String(emp.id))
  );

  return (
    <div className="space-y-3">
      {assignments.length === 0 && (
        <p className="text-sm text-text-secondary italic">No one assigned to this stage yet.</p>
      )}

      {assignments.map((assignment) => {
        const isDone = assignment.isDone || assignment.is_done || assignment.status === 'Completed';
        const empName = assignment.employeeName || assignment.employee_name || 'Worker';

        return (
          <div key={assignment.id} className="flex items-center justify-between rounded-input border border-border px-3 py-2 bg-surface/40">
            <span className="text-sm font-medium text-text-primary">{empName}</span>
            {isDone ? (
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle2 size={14} /> Done
              </span>
            ) : canMarkDone ? (
              <button
                type="button"
                onClick={() => handleMarkDone(assignment.id)}
                className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-hover font-medium transition-colors"
              >
                <Circle size={14} /> Mark my work done
              </button>
            ) : (
              <span className="text-xs text-text-secondary italic">Assigned — waiting</span>
            )}
          </div>
        );
      })}

      {availableEmployees.length === 0 && employees.length === 0 && (
        <p className="text-xs text-amber-600">
          No employees found in the database. Add staff in the Employees module first.
        </p>
      )}

      <div className="flex items-center gap-2 pt-2">
        <Select
          value={selectedEmployeeId}
          onChange={(val) => setSelectedEmployeeId(val?.target ? val.target.value : val)}
          className="flex-1 h-9 text-xs"
          options={[
            { label: 'Select employee to assign...', value: '' },
            ...availableEmployees.map((e) => ({
              label: `${e.firstName || e.first_name} ${e.lastName || e.last_name}`.trim(),
              value: String(e.id),
            })),
          ]}
        />

        <Button
          size="sm"
          onClick={handleAddPerson}
          disabled={!selectedEmployeeId || isAdding}
        >
          {isAdding ? 'Adding...' : 'Add'}
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