import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Settings2, ArrowLeft } from 'lucide-react';
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
import { BundleWorkflowModal } from './BundleWorkflowModal';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';
import { useOrderWorkflowSteps } from '../hooks/useOrderWorkflowSteps';
import { useBundlesByOrder } from '../hooks/useBundlesByOrder';
import { useOrderMovements } from '../hooks/useOrderMovements';

const TABS = ['Workflow Steps', 'Bundles', 'Movement Log'];

/**
 * OrderWorkflowCard — one order's collapsible workflow management card.
 *
 * "Assign Employees" (clicked from a bundle row in the Bundles tab)
 * sets `selectedBundle` AND switches `activeTab` to 'Workflow Steps'
 * in one action — this is what makes the Workflow Steps tab act as
 * the CENTRAL place for assignment, per the requested flow, instead
 * of an inline form appearing under the bundle row.
 *
 * Clicking any tab button directly always clears `selectedBundle` —
 * so navigating tabs normally shows the order-level view, and only
 * the explicit "Assign Employees" action enters a bundle's own
 * independent workflow state.
 */
export function OrderWorkflowCard({ order, isExpanded, onToggleExpand }) {
  const [activeTab, setActiveTab] = useState('Workflow Steps');
  const [isEditStructureOpen, setIsEditStructureOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);

  const { data: steps, isLoading: isStepsLoading } = useOrderWorkflowSteps(isExpanded ? order.id : null);
  const { data: bundles, isLoading: isBundlesLoading } = useBundlesByOrder(isExpanded ? order.id : null);
  const { data: movements, isLoading: isMovementsLoading } = useOrderMovements(isExpanded ? order.id : null);

  const activeStep = steps ? [...steps].sort((a, b) => a.stageOrder - b.stageOrder).find((s) => s.status !== 'Completed') : null;

  const canEditStructure = order.status === 'Pending' && (!bundles || bundles.length === 0);

  const handleTabClick = (tab) => {
    setSelectedBundle(null); // manual tab navigation always leaves bundle context
    setActiveTab(tab);
  };

  const handleAssignEmployeesClick = (bundle) => {
    setSelectedBundle(bundle);
    setActiveTab('Workflow Steps');
  };

  const handleBackToBundles = () => {
    setSelectedBundle(null);
    setActiveTab('Bundles');
  };

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
          {activeStep && !activeStep.assignedEmployeeId && !selectedBundle && (
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
                  onClick={() => handleTabClick(tab)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Workflow Steps' && !selectedBundle && canEditStructure && steps && (
              <Button variant="outline" size="sm" onClick={() => setIsEditStructureOpen(true)} className="mb-2">
                <Settings2 size={14} /> Edit Structure
              </Button>
            )}
          </div>

          {activeTab === 'Workflow Steps' && (
            selectedBundle ? (
              <div className="space-y-3">
                <button
                  onClick={handleBackToBundles}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ArrowLeft size={14} /> Back to bundles
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="info">Viewing: {selectedBundle.bundleNumber}</Badge>
                  <span className="text-xs text-text-secondary">
                    Quantity {selectedBundle.quantity} · independent from other bundles
                  </span>
                </div>
                <BundleWorkflowModal bundle={selectedBundle} steps={steps ?? []} onBack={handleBackToBundles} />
              </div>
            ) : isStepsLoading ? (
              <LoadingSkeleton rows={4} />
            ) : (
              <OrderStepsTable steps={steps ?? []} order={order} />
            )
          )}

          {activeTab === 'Bundles' && (
            isBundlesLoading ? <LoadingSkeleton rows={3} /> : (
              <BundleList
                bundles={bundles ?? []}
                steps={steps ?? []}
                orderId={order.id}
                totalQuantity={order.quantity}
                onSelectBundle={handleAssignEmployeesClick}
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