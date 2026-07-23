import { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogBundleMovement } from '../hooks/useLogBundleMovement';
import { employeesMockData } from '@/mocks/data/employees.mock';

/**
 * BundleList — shows every bundle for an order, with a "Log
 * Movement" action per bundle (PO Flow Step 5: employees log bundle
 * receipt and output at each stage).
 *
 * @param {Object} props
 * @param {ProductionBundle[]} props.bundles
 * @param {OrderWorkflowStep[]} props.steps - used to know the bundle's current stage name/order for logging
 */
export function BundleList({ bundles, steps }) {
  const [loggingBundleId, setLoggingBundleId] = useState(null);

  return (
    <div className="space-y-3">
      {bundles.map((bundle) => (
        <BundleRow
          key={bundle.id}
          bundle={bundle}
          steps={steps}
          isLogging={loggingBundleId === bundle.id}
          onToggleLog={() => setLoggingBundleId(loggingBundleId === bundle.id ? null : bundle.id)}
        />
      ))}
    </div>
  );
}

function BundleRow({ bundle, steps, isLogging, onToggleLog }) {
  const [employeeId, setEmployeeId] = useState(bundle.assignedEmployeeId ?? '');
  const [quantityReceived, setQuantityReceived] = useState(bundle.quantity);
  const [quantityOutput, setQuantityOutput] = useState(0);
  const [quantityWastage, setQuantityWastage] = useState(0);
  const [remarks, setRemarks] = useState('');

  const { mutate: logMovement, isPending } = useLogBundleMovement();

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
          <Button variant="outline" size="sm" onClick={onToggleLog}>
            {isLogging ? 'Cancel' : 'Log Movement'}
          </Button>
        </div>
      </div>

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
            <Button size="sm" onClick={handleLog} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Movement'}
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
};