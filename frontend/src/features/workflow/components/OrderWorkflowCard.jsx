import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { OrderStepsTable } from './OrderStepsTable';
import { BundleList } from './BundleList';
import { OrderMovementLog } from './OrderMovementLog';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';
import { useOrderWorkflowSteps } from '../hooks/useOrderWorkflowSteps';
import { useBundlesByOrder } from '../hooks/useBundlesByOrder';
import { useOrderMovements } from '../hooks/useOrderMovements';

const TABS = ['Workflow Steps', 'Bundles', 'Movement Log'];

/**
 * OrderWorkflowCard — one order's collapsible workflow management
 * card. Expands INLINE (no modal navigation) to show its Workflow
 * Steps / Bundles / Movement Log tabs directly on the page.
 *
 * @param {Object} props
 * @param {ProductionOrder} props.order
 * @param {boolean} props.isExpanded
 * @param {() => void} props.onToggleExpand
 */
export function OrderWorkflowCard({ order, isExpanded, onToggleExpand }) {
  const [activeTab, setActiveTab] = useState('Workflow Steps');

  // Only fetch this order's detail data once it's actually expanded —
  // avoids fetching steps/bundles/movements for every single card up
  // front (OrderWorkflowSection already does a lightweight steps
  // fetch for classification; this is the FULL data used once opened).
  const { data: steps, isLoading: isStepsLoading } = useOrderWorkflowSteps(isExpanded ? order.id : null);
  const { data: bundles, isLoading: isBundlesLoading } = useBundlesByOrder(isExpanded ? order.id : null);
  const { data: movements, isLoading: isMovementsLoading } = useOrderMovements(isExpanded ? order.id : null);

  const activeStep = steps ? [...steps].sort((a, b) => a.stageOrder - b.stageOrder).find((s) => s.status !== 'Completed') : null;

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

          <div className="flex gap-1 border-b border-border">
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

          {activeTab === 'Workflow Steps' && (
            isStepsLoading ? <LoadingSkeleton rows={4} /> : <OrderStepsTable steps={steps ?? []} order={order} />
          )}
          {activeTab === 'Bundles' && (
            isBundlesLoading ? <LoadingSkeleton rows={3} /> : <BundleList bundles={bundles ?? []} steps={steps ?? []} />
          )}
          {activeTab === 'Movement Log' && (
            <OrderMovementLog movements={movements} isLoading={isMovementsLoading} />
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