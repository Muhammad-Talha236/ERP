import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { OrderStepsTable } from './OrderStepsTable';
import { BundleList } from './BundleList';
import { OrderMovementLog } from './OrderMovementLog';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { getProductionOrderStatusVariant, getPriorityVariant } from '../utils/productionOrderStatusVariant';
import { useOrderWorkflowSteps } from '../hooks/useOrderWorkflowSteps';
import { useBundlesByOrder } from '../hooks/useBundlesByOrder';
import { useOrderMovements } from '../hooks/useOrderMovements';

const TABS = ['Overview', 'Workflow Steps', 'Bundles', 'Movement Log'];

export function OrderDetailModal({ open, onOpenChange, order }) {
  const [activeTab, setActiveTab] = useState('Overview');

  const { data: steps, isLoading: isStepsLoading } = useOrderWorkflowSteps(order?.id);
  const { data: bundles, isLoading: isBundlesLoading } = useBundlesByOrder(order?.id);
  const { data: movements, isLoading: isMovementsLoading } = useOrderMovements(order?.id);

  const totalCost = useMemo(() => {
    if (!steps) return 0;
    return steps.reduce((sum, s) => sum + s.expense + s.wagePerUnit * (order?.quantity ?? 0), 0);
  }, [steps, order]);

  const peopleInvolved = useMemo(() => {
    const names = new Set();
    (steps ?? []).forEach((s) => s.assignedEmployeeName && names.add(s.assignedEmployeeName));
    (bundles ?? []).forEach((b) => b.assignedEmployeeName && names.add(b.assignedEmployeeName));
    return Array.from(names);
  }, [steps, bundles]);

  /**
   * The "currently active" step — the first one not yet completed,
   * in stage order. Used to show a targeted "not assigned yet"
   * warning, rather than a generic/unhelpful one.
   */
  const activeStep = useMemo(() => {
    if (!steps) return null;
    const sorted = [...steps].sort((a, b) => a.stageOrder - b.stageOrder);
    return sorted.find((s) => s.status !== 'Completed') ?? null;
  }, [steps]);

  const showUnassignedWarning = activeStep && !activeStep.assignedEmployeeId;

  if (!order) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={order.poNumber}
      description={`${order.customerName} · ${order.productName}`}
      size="lg"
      footer={
        <button onClick={() => onOpenChange(false)} className="text-sm text-text-secondary hover:text-text-primary">
          Close
        </button>
      }
    >
      <div className="flex gap-1 border-b border-border mb-5 -mt-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Badge variant={getProductionOrderStatusVariant(order.status)}>{order.status}</Badge>
            <Badge variant={getPriorityVariant(order.priority)}>{order.priority} priority</Badge>
          </div>

          {/* --- Unassigned warning banner --- */}
          {showUnassignedWarning && (
            <div className="flex items-center gap-2 rounded-input border-l-4 border-l-warning border border-border bg-warning/10 px-4 py-3">
              <AlertTriangle size={16} className="text-warning shrink-0" />
              <p className="text-sm text-text-primary">
                <span className="font-semibold">{activeStep.stageName}</span> stage has no employee
                assigned yet — assign one in the Workflow Steps tab to start progress.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-secondary">Order date</p>
              <p className="text-text-primary font-medium">{format(new Date(order.orderDate), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-text-secondary">Delivery date</p>
              <p className="text-text-primary font-medium">{format(new Date(order.deliveryDate), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-text-secondary">Quantity</p>
              <p className="text-text-primary font-medium">{order.quantity.toLocaleString()} units</p>
            </div>
            <div>
              <p className="text-text-secondary">Order value</p>
              <p className="text-text-primary font-medium">${(order.quantity * order.unitPrice).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-text-secondary">Estimated production cost</p>
              <p className="text-text-primary font-medium">${totalCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-text-secondary">People involved</p>
              <p className="text-text-primary font-medium">{peopleInvolved.length > 0 ? peopleInvolved.join(', ') : '—'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Workflow Steps' && (
        isStepsLoading ? <LoadingSkeleton rows={4} /> : <OrderStepsTable steps={steps ?? []} order={order} />
      )}

      {activeTab === 'Bundles' && (
        isBundlesLoading ? <LoadingSkeleton rows={3} /> : <BundleList bundles={bundles ?? []} steps={steps ?? []} />
      )}

      {activeTab === 'Movement Log' && (
        <OrderMovementLog movements={movements} isLoading={isMovementsLoading} />
      )}
    </Modal>
  );
}

OrderDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  order: PropTypes.object,
};