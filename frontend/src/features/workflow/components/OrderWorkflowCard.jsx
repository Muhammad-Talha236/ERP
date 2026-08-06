import { useState } from 'react';
import { ChevronDown, ChevronRight, Settings2, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { BundleList } from './BundleList';
import { OrderMovementLog } from './OrderMovementLog';
import { EditStructureModal } from './EditStructureModal';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';
import { useOrderWorkflowSteps } from '../hooks/useOrderWorkflowSteps';
import { useBundlesByOrder } from '../hooks/useBundlesByOrder';
import { useOrderMovements } from '../hooks/useOrderMovements';

const TABS = ['Bundles', 'Movement Log'];

/**
 * OrderWorkflowCard — "Edit Structure" and "+ New Bundle" now live
 * together in the tab header row, both top-aligned next to the tabs.
 * "+ New Bundle" toggle state is owned here and passed down into
 * BundleList so BundleList no longer renders its own button.
 */
export function OrderWorkflowCard({ order, isExpanded, onToggleExpand }) {
  const [activeTab, setActiveTab] = useState('Bundles');
  const [isEditStructureOpen, setIsEditStructureOpen] = useState(false);
  const [isCreatingBundle, setIsCreatingBundle] = useState(false);

  const { data: steps, isLoading: isStepsLoading } = useOrderWorkflowSteps(isExpanded ? order.id : null);
  const { data: bundles, isLoading: isBundlesLoading } = useBundlesByOrder(isExpanded ? order.id : null);
  const { data: movements, isLoading: isMovementsLoading } = useOrderMovements(isExpanded ? order.id : null);

  const completedBundleCount = (bundles ?? []).filter((b) => b.status === 'Completed').length;
  const totalBundleCount = bundles?.length ?? 0;

  const deriveOrderStatusFromBundles = (orderBundles) => {
    if (!orderBundles || orderBundles.length === 0) return { status: 'Pending', currentStageOrder: 1 };
    const allCompleted = orderBundles.every((b) => b.status === 'Completed');
    if (allCompleted) return { status: 'Completed', currentStageOrder: Math.max(...orderBundles.map((b) => b.currentStageOrder ?? 1)) };
    const allNotStarted = orderBundles.every((b) => b.status === 'Not Started');
    if (allNotStarted) return { status: 'Pending', currentStageOrder: 1 };
    return { status: 'In Progress', currentStageOrder: Math.max(...orderBundles.map((b) => b.currentStageOrder ?? 1)) };
  };

  const derivedStatus = deriveOrderStatusFromBundles(bundles ?? []);
  const displayOrderStatus = order.status === 'Completed' || order.status === 'Cancelled' ? order.status : derivedStatus.status;

  const canEditStructure =
    displayOrderStatus === 'Pending' && totalBundleCount <= 1 && (bundles?.[0]?.status ?? 'Not Started') === 'Not Started';

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
        <div className="flex items-center gap-2">
          {totalBundleCount > 0 && (
            <span className="text-xs text-text-secondary">
              {completedBundleCount}/{totalBundleCount} bundles complete
            </span>
          )}
          <Badge variant={getProductionOrderStatusVariant(displayOrderStatus)}>{displayOrderStatus}</Badge>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
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

            {activeTab === 'Bundles' && (
              <div className="flex items-center gap-2">
                {canEditStructure && steps && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditStructureOpen(true)}>
                    <Settings2 size={14} /> Edit Structure
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setIsCreatingBundle((v) => !v)}>
                  <Plus size={14} /> {isCreatingBundle ? 'Cancel' : 'New Bundle'}
                </Button>
              </div>
            )}
          </div>

          {activeTab === 'Bundles' && (
            isBundlesLoading || isStepsLoading ? <LoadingSkeleton rows={3} /> : (
              <>
                <BundleList
                  bundles={bundles ?? []}
                  steps={steps ?? []}
                  orderId={order.id}
                  isCreatingBundle={isCreatingBundle}
                  onCreateBundleDone={() => setIsCreatingBundle(false)}
                  onStartCreatingBundle={() => setIsCreatingBundle(true)}
                />
                {steps && (
                  <EditStructureModal open={isEditStructureOpen} onOpenChange={setIsEditStructureOpen} orderId={order.id} steps={steps} />
                )}
              </>
            )
          )}

          {activeTab === 'Movement Log' && (
            <OrderMovementLog movements={movements ?? []} isLoading={isMovementsLoading} />
          )}
        </div>
      )}
    </div>
  );
}

OrderWorkflowCard.propTypes = {
  order: PropTypes.object.isRequired,
  isExpanded:PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};