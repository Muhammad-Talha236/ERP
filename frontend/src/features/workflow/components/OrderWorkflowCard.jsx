import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Settings2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { OrderStepsTable } from './OrderStepsTable';
import { BundleList } from './BundleList';
import { OrderMovementLog } from './OrderMovementLog';
import { EditStructureModal } from './EditStructureModal';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';
import { useOrderWorkflowSteps } from '../hooks/useOrderWorkflowSteps';
import { useBundlesByOrder } from '../hooks/useBundlesByOrder';
import { useOrderMovements } from '../hooks/useOrderMovements';

const TABS = ['Workflow Steps', 'Bundles', 'Movement Log'];

/**
 * OrderWorkflowCard — one order's collapsible workflow management
 * card.
 *
 * NEW: an "Edit Structure" button appears ONLY when the order
 * hasn't started yet (status === 'Pending', meaning every step is
 * still 'Not Started') — this is what lets the user add, remove,
 * rename, or reposition stages via EditStructureModal. Once any
 * stage has begun, the button disappears, since changing the
 * pipeline mid-production would corrupt in-progress work/assignments.
 */
export function OrderWorkflowCard({ order, isExpanded, onToggleExpand }) {
  const [activeTab, setActiveTab] = useState('Workflow Steps');
  const [isEditStructureOpen, setIsEditStructureOpen] = useState(false);

  const { data: steps, isLoading: isStepsLoading } = useOrderWorkflowSteps(isExpanded ? order.id : null);
  const { data: bundles, isLoading: isBundlesLoading } = useBundlesByOrder(isExpanded ? order.id : null);
  const { data: movements, isLoading: isMovementsLoading } = useOrderMovements(isExpanded ? order.id : null);

  const activeStep = steps ? [...steps].sort((a, b) => a.stageOrder - b.stageOrder).find((s) => s.status !== 'Completed') : null;

  // The order hasn't started if EVERY step is still 'Not Started'.
  const canEditStructure = order.status === 'Pending';

  return (
    <div className="rounded-card border border-border bg-background overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 hover:bg-surface/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? <ChevronDown size={16} className="text-text-secondary" /> : <ChevronRight size={16} className="text-text-secondary" />}
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {order.poNumber} · {order.productName}
            </p>
            <p className="text-xs text-text-secondary">
              {order.customerName} · Qty {order.quantity.toLocaleString()} · Due {format(new Date(order.deliveryDate), 'MMM d')}
            </p>
          </div>
        </div>
        <Badge variant={getProductionOrderStatusVariant(order.status)}>{order.status}</Badge>
      </button>

      {isExpanded && (
        <div className="border-t border-border p-5 space-y-4">
          {activeStep && !activeStep.assignedEmployeeId && (
            <div className="flex items-center gap-2 rounded-input border-l-4 border-l-warning border border-border bg-warning/10 px-4 py-3">
              <AlertTriangle size={16} className="text-warning shrink-0" />
              <p className="text-sm text-text-primary">
                <span className="font-semibold">{activeStep.stageName}</span> stage has no employee assigned yet.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-border">
            <div className="flex gap-1">
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

            {activeTab === 'Workflow Steps' && canEditStructure && steps && (
              <Button variant="outline" size="sm" onClick={() => setIsEditStructureOpen(true)} className="mb-2">
                <Settings2 size={14} /> Edit Structure
              </Button>
            )}
          </div>

          {activeTab === 'Workflow Steps' && (
            isStepsLoading ? <LoadingSkeleton rows={4} /> : <OrderStepsTable steps={steps ?? []} order={order} />
          )}
          {activeTab === 'Bundles' && (
  isBundlesLoading ? <LoadingSkeleton rows={3} /> : (
    <BundleList
      bundles={bundles ?? []}
      steps={steps ?? []}
      orderId={order.id}
      totalQuantity={order.quantity}
    />
  )
)}
          {activeTab === 'Movement Log' && (
            <OrderMovementLog movements={movements} isLoading={isMovementsLoading} />
          )}

          {steps && (
            <EditStructureModal
              open={isEditStructureOpen}
              onOpenChange={setIsEditStructureOpen}
              orderId={order.id}
              steps={steps}
            />
          )}
        </div>
      )}
    </div>
  );
}

OrderWorkflowCard.propTypes = {
  order: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};