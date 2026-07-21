import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductionStatsCards } from './components/ProductionStatsCards';
import { ProductionKanbanBoard } from './components/ProductionKanbanBoard';
import { NewOrderFormModal } from './components/NewOrderFormModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useProductionOrders } from './hooks/useProductionOrders';

/**
 * ProductionPage — the main "Production" screen: stat cards, the
 * live Kanban board, and full PO detail on click.
 */
export function ProductionPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailModal, setDetailModal] = useState({ open: false, order: null });

  const { data: orders, isLoading, isError, refetch } = useProductionOrders();

  if (isError) {
    return (
      <AppLayout title="Production" subtitle="Track orders through the shop floor">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Production" subtitle="Track orders through the shop floor">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <ProductionStatsCards orders={orders ?? []} />
          <Button onClick={() => setIsFormOpen(true)}>+ New Order</Button>
        </div>

        {!isLoading && (
          <ProductionKanbanBoard
            orders={orders ?? []}
            onCardClick={(order) => setDetailModal({ open: true, order })}
          />
        )}
      </div>

      <NewOrderFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />

      <OrderDetailModal
        open={detailModal.open}
        onOpenChange={(open) => setDetailModal({ open, order: open ? detailModal.order : null })}
        order={detailModal.order}
      />
    </AppLayout>
  );
}