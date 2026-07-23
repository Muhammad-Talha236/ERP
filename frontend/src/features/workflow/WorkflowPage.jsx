import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OrderWorkflowSection } from './components/OrderWorkflowSection';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { GitBranch } from 'lucide-react';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';

/**
 * WorkflowPage — manage stages, bundles, and employee assignments
 * for every active order, split into two groups instead of a
 * dropdown selector:
 *
 *  - "Needs Setup": orders where NOT A SINGLE step has an assigned
 *    employee yet (nothing has started).
 *  - "In Progress": orders where at least one step already has
 *    someone assigned — actively being worked.
 *
 * Completed/Cancelled orders are excluded — nothing left to manage.
 * Clicking an order expands it inline (no modal, no separate page
 * navigation) to show its Workflow Steps / Bundles / Movement Log tabs.
 */
export function WorkflowPage() {
  const { data: orders, isLoading } = useProductionOrders();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const activeOrders = useMemo(
    () => (orders ?? []).filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled'),
    [orders]
  );

  if (isLoading) {
    return (
      <AppLayout title="Workflow" subtitle="Manage stages, bundles, and employee assignments">
        <LoadingSkeleton rows={4} />
      </AppLayout>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <AppLayout title="Workflow" subtitle="Manage stages, bundles, and employee assignments">
        <EmptyState
          icon={GitBranch}
          title="No active orders"
          description="Orders will appear here once created and until they're completed."
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Workflow" subtitle="Manage stages, bundles, and employee assignments">
      <div className="space-y-8">
        <OrderWorkflowSection
          title="Needs Setup"
          description="No employees assigned yet — nothing has started."
          orders={activeOrders}
          filterFn="unassigned"
          expandedOrderId={expandedOrderId}
          onToggleExpand={setExpandedOrderId}
        />

        <OrderWorkflowSection
          title="In Progress"
          description="At least one stage already has an assigned employee."
          orders={activeOrders}
          filterFn="assigned"
          expandedOrderId={expandedOrderId}
          onToggleExpand={setExpandedOrderId}
        />
      </div>
    </AppLayout>
  );
}