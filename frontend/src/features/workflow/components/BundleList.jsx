import { useState } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SplitIntoBundlesForm } from './SplitIntoBundlesForm';
import { AssignEmployeesModal } from './AssignEmployeesModal';
import { useLogBundleMovement } from '../hooks/useLogBundleMovement';
import { useUpdateBundle } from '../hooks/useUpdateBundle';
import { useDeleteBundle } from '../hooks/useDeleteBundle';
import { useEmployees } from '../hooks/useEmployees';

export function BundleList({ bundles, steps, orderId, isCreatingBundle, onCreateBundleDone, onStartCreatingBundle }) {
  const [loggingBundleId, setLoggingBundleId] = useState(null);
  const [editingBundleId, setEditingBundleId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [assignBundle, setAssignBundle] = useState(null);

  const { mutate: deleteBundle, isPending: isDeleting } = useDeleteBundle();

  const firstStage = [...steps].sort((a, b) => a.stageOrder - b.stageOrder)[0];

  const handleConfirmDelete = () => {
    setDeleteError(null);
    deleteBundle(
      { bundleId: deleteTarget.id, orderId },
      {
        onSuccess: () => setDeleteTarget(null),
        onError: (err) => setDeleteError(err.message || 'Failed to delete bundle.'),
      }
    );
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

      {bundles.length === 0 && !isCreatingBundle ? (
        <div className="rounded-input border border-border p-4 bg-surface">
          <p className="text-sm font-semibold text-text-primary">No bundles yet</p>
          <p className="text-xs text-text-secondary mt-1">
            Create the first bundle to begin tracking this order on the shop floor.
          </p>
          <Button size="sm" className="mt-3" onClick={() => onStartCreatingBundle && onStartCreatingBundle()}>
            Add First Bundle
          </Button>
        </div>
      ) : (
        bundles.map((bundle) => (
          <BundleRow
            key={bundle.id}
            bundle={bundle}
            orderId={orderId}
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
        ))
      )}

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

function BundleRow({ bundle, orderId, isLogging, onToggleLog, isEditing, onToggleEdit, onDeleteClick, onAssignClick }) {
  const queryClient = useQueryClient();
  
  const { data: employees = [] } = useEmployees();

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

  const parsedEditQty = Number(editQuantity) || 0;
  const isEditValid = parsedEditQty > 0;

  // Check agar bundle pehle se logged hai
  const storageKey = `bundle_logged_${bundle.id}`;
  const isLocallyLogged = localStorage.getItem(storageKey) === 'true';
  const isAlreadyLogged = bundle.status === 'Completed' || bundle.isLogged === true || isLocallyLogged;

  // Validation calculations
  const recNum = Number(quantityReceived) || 0;
  const outNum = Number(quantityOutput) || 0;
  const wastNum = Number(quantityWastage) || 0;

  const isTotalValid = (outNum + wastNum) === recNum;
  
  // Flexible matching (handles string vs number ID type differences)
  const matchedEmployee = employees.find((e) => String(e.id) === String(employeeId));
  const isEmployeeSelected = Boolean(matchedEmployee);

  const isLogFormValid = isTotalValid && isEmployeeSelected && !isAlreadyLogged;

  const handleLog = () => {
    if (!isLogFormValid) return;

    logMovement({
      bundleId: bundle.id,
      stageName: bundle.currentStageName,
      stageOrder: bundle.currentStageOrder,
      loggedByEmployeeId: employeeId,
      loggedByEmployeeName: `${matchedEmployee.firstName} ${matchedEmployee.lastName}`,
      quantityReceived: recNum,
      quantityOutput: outNum,
      quantityWastage: wastNum,
      remarks,
    }, { 
      onSuccess: () => {
        localStorage.setItem(storageKey, 'true');
        
        queryClient.invalidateQueries({ queryKey: ['bundles', orderId] });
        queryClient.invalidateQueries({ queryKey: ['movement-logs', orderId] });
        onToggleLog(); 
      } 
    });
  };

  const handleSaveEdit = () => {
    if (!isEditValid) return;
    setEditError(null);
    updateBundle(
      { bundleId: bundle.id, updates: { quantity: parsedEditQty } },
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
          <Badge statusVariant={statusVariant}>{bundle.status}</Badge>
          <Button variant="outline" size="sm" onClick={onAssignClick}>
            Assign Employees
          </Button>
          <button onClick={onToggleEdit} className="text-text-secondary hover:text-primary transition-colors" aria-label="Edit bundle">
            <Pencil size={14} />
          </button> 
          <button onClick={onDeleteClick} className="text-text-secondary hover:text-danger transition-colors" aria-label="Delete bundle">
            <Trash2 size={14} />
          </button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleLog}
          >
            {isAlreadyLogged ? 'Already Logged' : (isLogging ? 'Cancel' : 'Log')}
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-end gap-3">
            <Input 
              label="Quantity" 
              type="number" 
              min="1"
              value={editQuantity} 
              onChange={(e) => {
                const val = e.target.value;
                setEditQuantity(val === '' ? '' : Math.max(1, Number(val)));
              }} 
            />
            <Button size="sm" onClick={handleSaveEdit} disabled={isUpdating || !isEditValid}>
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
          <Input 
            label="Received" 
            type="number" 
            min="0"
            value={quantityReceived} 
            onChange={(e) => {
              const val = e.target.value;
              setQuantityReceived(val === '' ? '' : Math.max(0, Number(val)));
            }} 
            disabled={isAlreadyLogged}
          />
          <Input 
            label="Output" 
            type="number" 
            min="0"
            value={quantityOutput} 
            onChange={(e) => {
              const val = e.target.value;
              setQuantityOutput(val === '' ? '' : Math.max(0, Number(val)));
            }} 
            disabled={isAlreadyLogged}
          />
          <Input 
            label="Wastage" 
            type="number" 
            min="0"
            value={quantityWastage} 
            onChange={(e) => {
              const val = e.target.value;
              setQuantityWastage(val === '' ? '' : Math.max(0, Number(val)));
            }} 
            disabled={isAlreadyLogged}
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Logged by Employee</label>
            <select
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-text-primary"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled={isAlreadyLogged}
            >
              <option value="">Select employee from database...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.id})
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <Input label="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional note" disabled={isAlreadyLogged} />
          </div>

          {!isAlreadyLogged && !isTotalValid && (
            <div className="col-span-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
              ⚠️ Error: Output ({outNum}) + Wastage ({wastNum}) must equal Received ({recNum}). Current Total: {outNum + wastNum}
            </div>
          )}

          {!isAlreadyLogged && isTotalValid && !isEmployeeSelected && (
            <div className="col-span-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              ⚠️ Please select a valid employee from the database dropdown.
            </div>
          )}

          <div className="col-span-2 flex justify-end">
            <Button 
              size="sm" 
              onClick={handleLog} 
              disabled={isLoggingPending || !isLogFormValid}
            >
              {isAlreadyLogged ? 'Already Logged' : (isLoggingPending ? 'Saving...' : 'Save Movement')}
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
  onStartCreatingBundle: PropTypes.func.isRequired,
};