import { useState, useEffect, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { OrderStepsTable } from '@/features/workflow/components/OrderStepsTable';
import { BundleList } from '@/features/workflow/components/BundleList';
import { OrderMovementLog } from '@/features/workflow/components/OrderMovementLog';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';
import { useOrderWorkflowSteps } from '@/features/workflow/hooks/useOrderWorkflowSteps';
import { useBundlesByOrder } from '@/features/workflow/hooks/useBundlesByOrder';
import { useOrderMovements } from '@/features/workflow/hooks/useOrderMovements';

const TABS = ['Workflow Steps', 'Bundles', 'Movement Log'];

/**
 * WorkflowPage — the workflow management screen (PO Flow Steps 4-5-7):
 * per-order editable steps, bundle assignment/tracking, and the
 * movement log. Split out from Production's detail modal into its
 * own dedicated page per team's request.
 *
 * The order to manage is picked via a dropdown, pre-selected from
 * the URL's ?orderId= search param when navigated here from the
 * Orders/Kanban pages' "Manage Workflow" button.
 */
export function WorkflowPage() {
  const search = useSearch({ strict: false });
  const { data: orders, isLoading: isOrdersLoading } = useProductionOrders();

  const [selectedOrderId, setSelectedOrderId] = useState(search?.orderId ?? '');
  const [activeTab, setActiveTab] = useState('Workflow Steps');

  // Sync selection if we arrive here later with a different ?orderId=
  useEffect(() => {
    if (search?.orderId) setSelectedOrderId(search.orderId);
  }, [search?.orderId]);

  const selectedOrder = useMemo(
    () => (orders ?? []).find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const { data: steps, isLoading: isStepsLoading } = useOrderWorkflowSteps(selectedOrderId);
  const { data: bundles, isLoading: isBundlesLoading } = useBundlesByOrder(selectedOrderId);
  const { data: movements, isLoading: isMovementsLoading } = useOrderMovements(selectedOrderId);

  const activeStep = useMemo(() => {
    if (!steps) return null;
    return [...steps].sort((a, b) => a.stageOrder - b.stageOrder).find((s) => s.status !== 'Completed') ?? null;
  }, [steps]);

  return (
    <AppLayout title="Workflow" subtitle="Manage stages, bundles, and employee assignments">
      <div className="space-y-6">
        <div className="rounded-card border border-border bg-background p-6">
          <Select
            label="Select an order to manage"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            options={[
              { label: isOrdersLoading ? 'Loading orders...' : 'Select an order', value: '' },
              ...(orders ?? []).map((o) => ({ label: `${o.poNumber} — ${o.productName}`, value: o.id })),
            ]}
          />
        </div>

        {!selectedOrder ? (
          <p className="text-sm text-text-secondary text-center py-12">
            Select an order above to view and manage its workflow.
          </p>
        ) : (
          <>
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
              isStepsLoading ? <LoadingSkeleton rows={4} /> : <OrderStepsTable steps={steps ?? []} order={selectedOrder} />
            )}
            {activeTab === 'Bundles' && (
              isBundlesLoading ? <LoadingSkeleton rows={3} /> : <BundleList bundles={bundles ?? []} steps={steps ?? []} />
            )}
            {activeTab === 'Movement Log' && (
              <OrderMovementLog movements={movements} isLoading={isMovementsLoading} />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}   