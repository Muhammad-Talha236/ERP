import { useState } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SplitIntoBundlesForm } from './SplitIntoBundlesForm';
import { AssignEmployeesModal } from './AssignEmployeesModal';
import { useLogBundleMovement } from '../hooks/useLogBundleMovement';
import { useUpdateBundle } from '../hooks/useUpdateBundle';
import { useDeleteBundle } from '../hooks/useDeleteBundle';
import { employeesMockData } from '@/mocks/data/employees.mock';

/**
 * BundleList — "+ New Bundle" trigger now lives in OrderWorkflowCard's
 * header (next to Edit Structure), so this component just reacts to
 * `isCreatingBundle` passed down as a prop, rather than owning its
 * own toggle button.
 */
export function BundleList({ bundles, steps, orderId, isCreatingBundle, onCreateBundleDone }) {
  const [loggingBundleId, setLoggingBundleId] = useState(null);
  const [editingBundleId, setEditingBundleId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [assignBundle, setAssignBundle] = useState(null);

  const { mutate: deleteBundle, isPending: isDeleting } = useDeleteBundle();

  const firstStage = [...steps].sort((a, b) => a.stageOrder - b.stageOrder)[0];

  const handleConfirmDelete = () => {
    setDeleteError(null);
    deleteBundle(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (err) => setDeleteError(err.message || 'Failed to delete bundle.'),
    });
  };

  return (
    <div className="space-y-3">
      {isCreatingBundle && (
        <SplitIntoBundlesForm
          orderId={orderId}
          bundles={bundles}
          firstStageName={firstStage?.stageName ?? 'Stage 1'}
          onDone={onCreateBundleDone}
        />
      )}

      {bundles.map((bundle) => (
        <BundleRow
          key={bundle.id}
          bundle={bundle}
          isLogging={loggingBundleId === bundle.id}
          onToggleLog={() => setLoggingBundleId(loggingBundleId === bundle.id ? null : bundle.id)}
          isEditing={editingBundleId === bundle.id}
          onToggleEdit={() => setEditingBundleId(editingBundleId === bundle.id ? null : bundle.id)}
          onDeleteClick={() => {
            setDeleteError(null);
            setDeleteTarget(bundle);
          }}
          onAssignClick={() => setAssignBundle(bundle)}
        />
      ))}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        title="Delete Bundle?"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.bundleNumber}? Its ${deleteTarget.quantity} units will be moved to another bundle in this order. Any logged movements for it will remain in history.${deleteError ? `\n\n${deleteError}` : ''}`
            : ''
        }
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />

      <AssignEmployeesModal
        open={Boolean(assignBundle)}
        onOpenChange={(open) => !open && setAssignBundle(null)}
        bundle={assignBundle}
        steps={steps}
      />
    </div>
  );
}

function BundleRow({ bundle, isLogging, onToggleLog, isEditing, onToggleEdit, onDeleteClick, onAssignClick }) {
  const [employeeId, setEmployeeId] = useState(bundle.assignedEmployeeId ?? '');
  const [quantityReceived, setQuantityReceived] = useState(bundle.quantity);
  const [quantityOutput, setQuantityOutput] = useState(0);
  const [quantityWastage, setQuantityWastage] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [editQuantity, setEditQuantity] = useState(bundle.quantity);
  const [editError, setEditError] = useState(null);

  const { mutate: logMovement, isPending: isLoggingPending } = useLogBundleMovement();
  const { mutate: updateBundle, isPending: isUpdating } = useUpdateBundle();

  const statusVariant = bundle.status === 'Completed' ? 'success' : bundle.status === 'In Progress' ? 'info' : 'neutral';

  const handleLog = () => {
    const employee = employeesMockData.find((e) => e.id === employeeId);
    logMovement({
      bundleId: bundle.id,
      stageName: bundle.currentStageName,
      stageOrder: bundle.currentStageOrder,
      loggedByEmployeeId: employeeId,
      loggedByEmployeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
      quantityReceived: Number(quantityReceived),
      quantityOutput: Number(quantityOutput),
      quantityWastage: Number(quantityWastage),
      remarks,
    }, { onSuccess: () => onToggleLog() });
  };

  const handleSaveEdit = () => {
    setEditError(null);
    updateBundle(
      { bundleId: bundle.id, updates: { quantity: Number(editQuantity) } },
      { onSuccess: () => onToggleEdit(), onError: (err) => setEditError(err.message || 'Failed to update quantity.') }
    );
  };

  const handleCancelEdit = () => {
    setEditQuantity(bundle.quantity);
    setEditError(null);
    onToggleEdit();
  };

  return (
    <div className="rounded-input border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">{bundle.bundleNumber}</p>
          <p className="text-xs text-text-secondary">
            Qty: {bundle.quantity} · {bundle.currentStageName} · {bundle.assignedEmployeeName || 'Unassigned'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>{bundle.status}</Badge>
          <Button variant="outline" size="sm" onClick={onAssignClick}>
            Assign Employees
          </Button>
          <button onClick={onToggleEdit} className="text-text-secondary hover:text-primary transition-colors" aria-label="Edit bundle">
            <Pencil size={14} />
          </button> 
          <button onClick={onDeleteClick} className="text-text-secondary hover:text-danger transition-colors" aria-label="Delete bundle">
            <Trash2 size={14} />
          </button>
          <Button variant="outline" size="sm" onClick={onToggleLog}>
            {isLogging ? 'Cancel' : 'Log'}
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-end gap-3">
            <Input label="Quantity" type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} />
            <Button size="sm" onClick={handleSaveEdit} disabled={isUpdating}>
              <Check size={14} /> {isUpdating ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X size={14} /> Cancel
            </Button>
          </div>
          {editError && <p className="text-xs text-danger mt-2">{editError}</p>}
        </div>
      )}

      {isLogging && (
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
          <Input label="Received" type="number" value={quantityReceived} onChange={(e) => setQuantityReceived(e.target.value)} />
          <Input label="Output" type="number" value={quantityOutput} onChange={(e) => setQuantityOutput(e.target.value)} />
          <Input label="Wastage" type="number" value={quantityWastage} onChange={(e) => setQuantityWastage(e.target.value)} />
          <Input label="Logged by (employee ID)" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="e.g. emp-001" />
          <div className="col-span-2">
            <Input label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional note" />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button size="sm" onClick={handleLog} disabled={isLoggingPending}>
              {isLoggingPending ? 'Saving...' : 'Save Movement'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

BundleList.propTypes = {
  bundles: PropTypes.array.isRequired,
  steps: PropTypes.array,
  orderId: PropTypes.string.isRequired,
  isCreatingBundle: PropTypes.bool,
  onCreateBundleDone: PropTypes.func.isRequired,
};