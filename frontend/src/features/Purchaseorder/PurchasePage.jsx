import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductionStatsCards } from './components/ProductionStatsCards';
import { OrdersTable } from './components/OrdersTable';
import { NewOrderFormModal } from './components/NewOrderFormModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useProductionOrders } from './hooks/useProductionOrders';

/**
 * PurchasePage — "Orders" screen: create and list customer
 * purchase orders. "View" now navigates straight to the Workflow
 * page (no separate overview modal) since that's where all the
 * useful order detail actually lives.
 */
export function PurchasePage() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
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
          onViewClick={() => navigate({ to: '/workflow' })}
        />
      </div>

      <NewOrderFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
    </AppLayout>
  );
}