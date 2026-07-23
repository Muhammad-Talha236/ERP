import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductionKanbanBoard } from '@/features/kanban/components/ProductionKanbanBoard';
import { OrderOverviewModal } from '@/features/workflow/components/OrderOverviewModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';

/**
 * KanbanPage — live, read-only status board (PO Flow Step 6),
 * split out from ProductionPage into its own dedicated section.
 *
 * Reuses ProductionKanbanBoard and OrderOverviewModal directly from
 * the production feature folder rather than duplicating them — the
 * underlying data/logic is identical, only the page/route changed.
 */
export function KanbanPage() {
  const [viewModal, setViewModal] = useState({ open: false, order: null });
  const { data: orders, isLoading, isError, refetch } = useProductionOrders();

  if (isError) {
    return (
      <AppLayout title="Kanban" subtitle="Live view of order status across stages">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Kanban" subtitle="Live view of order status across stages">
      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <ProductionKanbanBoard
          orders={orders ?? []}
          onCardClick={(order) => setViewModal({ open: true, order })}
        />
      )}

      <OrderOverviewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ open, order: open ? viewModal.order : null })}
        order={viewModal.order}
      />
    </AppLayout>
  );
}