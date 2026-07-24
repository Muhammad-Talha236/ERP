import { AppLayout } from '@/components/layout/AppLayout';
import { ProductionKanbanBoard } from './components/ProductionKanbanBoard';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';

export function KanbanPage() {
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
      {isLoading ? <LoadingSkeleton rows={4} /> : <ProductionKanbanBoard orders={orders ?? []} />}
    </AppLayout>
  );
}