import { useState } from 'react';
import { Download } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { POStatsCards } from './components/POStatsCards';
import { POTable } from './components/POTable';
import { POFormModal } from './components/POFormModal';
import { PODetailModal } from './components/PODetailModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { usePurchaseOrders } from './hooks/usestockorder';

export function StockOrderpage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailModal, setDetailModal] = useState({ open: false, po: null });

  const { data: purchaseOrders, isLoading, isError, refetch } = usePurchaseOrders();

  if (isError) {
    return (
      <AppLayout title="Purchase Orders" subtitle="Manage suppliers and invoices">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Stock Orders" subtitle="Manage suppliers and invoices">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <POStatsCards purchaseOrders={purchaseOrders ?? []} />
          <div className="flex gap-3">
            <Button variant="secondary">
              <Download size={16} /> Export
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>+ New PO</Button>
          </div>
        </div>

        <POTable
          purchaseOrders={purchaseOrders}
          isLoading={isLoading}
          onViewClick={(po) => setDetailModal({ open: true, po })}
        />
      </div>

      <POFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />

      <PODetailModal
        open={detailModal.open}
        onOpenChange={(open) => setDetailModal({ open, po: open ? detailModal.po : null })}
        po={detailModal.po}
      />
    </AppLayout>
  );
}