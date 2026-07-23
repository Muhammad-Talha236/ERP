import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductionStatsCards } from './components/ProductionStatsCards';
import { OrdersTable } from './components/OrdersTable';
import { NewOrderFormModal } from './components/NewOrderFormModal';
import { OrderOverviewModal } from '@/features/workflow/components/OrderOverviewModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useProductionOrders } from './hooks/useProductionOrders';

/**
 * ProductionPage — "O  rders" screen: create and list customer
 * production orders. The live status board (Kanban) and detailed
 * workflow management (steps/bundles/movements) now live on their
 * own separate pages (/kanban and /workflow) per team's request to
 * split these into distinct sections.
 */
export function PurchasePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewModal, setViewModal] = useState({ open: false, order: null });

  const { data: orders, isLoading, isError, refetch } = useProductionOrders();

  if (isError) {
    return (
      <AppLayout title="Orders" subtitle="Create and manage customer orders">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Orders" subtitle="Create and manage customer orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <ProductionStatsCards orders={orders ?? []} />
          <Button onClick={() => setIsFormOpen(true)}>+ New Order</Button>
        </div>

        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          onViewClick={(order) => setViewModal({ open: true, order })}
        />
      </div>

      <NewOrderFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />

      <OrderOverviewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ open, order: open ? viewModal.order : null })}
        order={viewModal.order}
      />
    </AppLayout>
  );
}