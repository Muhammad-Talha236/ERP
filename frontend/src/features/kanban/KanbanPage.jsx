import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductionKanbanBoard } from './components/ProductionKanbanBoard';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { useAllBundles } from './hooks/useAllBundles';
import { useAllOrderWorkflowSteps } from './hooks/useAllOrderWorkflowSteps';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';

/**
 * KanbanPage — each order card now shows total expense and a
 * Bundles In/Out breakdown (derived from bundle status), plus
 * received/completed dates surface in the detail modal — closing
 * the gap against the "date received/completed, expenses, bundles
 * in/out" requirement.
 */
export function KanbanPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: bundles, isLoading: isBundlesLoading, isError, refetch } = useAllBundles();
  const { data: orders, isLoading: isOrdersLoading } = useProductionOrders();
  const { data: allSteps, isLoading: isStepsLoading } = useAllOrderWorkflowSteps();

  if (isError) {
    return (
      <AppLayout title="Kanban" subtitle="Live view of order status across stages">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  const isLoading = isBundlesLoading || isOrdersLoading || isStepsLoading;

  const ordersEnriched = (orders ?? []).map((order) => {
    const orderBundles = (bundles ?? []).filter((b) => b.orderId === order.id);
    const orderSteps = (allSteps ?? []).filter((s) => s.orderId === order.id);

    return {
      ...order,
      bundles: orderBundles,
      bundlesIn: orderBundles.filter((b) => b.status !== 'Completed').length,
      bundlesOut: orderBundles.filter((b) => b.status === 'Completed').length,
      totalExpense: orderSteps.reduce((sum, s) => sum + s.expense, 0),
    };
  });

  return (
    <AppLayout title="Kanban" subtitle="Live view of order status across stages">
      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <ProductionKanbanBoard orders={ordersEnriched} onCardClick={setSelectedOrder} />
      )}

      <OrderSummaryModal
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
      />
    </AppLayout>
  );
}