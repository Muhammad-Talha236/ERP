import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductionKanbanBoard } from './components/ProductionKanbanBoard';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { useAllBundles } from './hooks/useAllBundles';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';

/**
 * KanbanPage — back to ORDER-level cards (Pending / In Progress /
 * Completed), each showing a "X/Y bundles complete" rollup. Clicking
 * a card opens OrderSummaryModal with order info + bundle breakdown.
 */
export function KanbanPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: bundles, isLoading: isBundlesLoading, isError, refetch } = useAllBundles();
  const { data: orders, isLoading: isOrdersLoading } = useProductionOrders();

  if (isError) {
    return (
      <AppLayout title="Kanban" subtitle="Live view of order status across stages">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  const isLoading = isBundlesLoading || isOrdersLoading;

  const ordersWithBundleCounts = (orders ?? []).map((order) => {
    const orderBundles = (bundles ?? []).filter((b) => b.orderId === order.id);
    return {
      ...order,
      totalBundles: orderBundles.length,
      completedBundles: orderBundles.filter((b) => b.status === 'Completed').length,
    };
  });

  return (
    <AppLayout title="Kanban" subtitle="Live view of order status across stages">
      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <ProductionKanbanBoard orders={ordersWithBundleCounts} onCardClick={setSelectedOrder} />
      )}

      <OrderSummaryModal
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
        bundles={(bundles ?? []).filter((b) => b.orderId === selectedOrder?.id)}
      />
    </AppLayout>
  );
}