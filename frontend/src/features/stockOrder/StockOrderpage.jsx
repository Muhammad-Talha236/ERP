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
  const [detailModal, setDetailModal] = useState({ open: false, poId: null });

  const { data: purchaseOrders, isLoading, isError, refetch } = usePurchaseOrders();

  // FIX: modal ko hamesha LIVE po do, list se by-id lookup karke —
  // ek stale snapshot state nahi rakhte. Jaise hi payment ke baad
  // ['purchaseOrders'] query invalidate/refetch hoti hai, ye
  // automatically naya paidAmount/status utha lega, aur PODetailModal
  // ka useForm({ values: ... }) khud-ba-khud Amount field ko naye
  // "remaining" par reset kar dega.
  const liveDetailPo = detailModal.poId
    ? (purchaseOrders ?? []).find((p) => p.id === detailModal.poId) ?? null
    : null;

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <POStatsCards purchaseOrders={purchaseOrders ?? []} />

  <div className="w-full sm:w-auto">
    <Button
      onClick={() => setIsFormOpen(true)}
      className="w-full sm:w-auto"
    >
      + New PO
    </Button>
  </div>
</div>

        <POTable
          purchaseOrders={purchaseOrders}
          isLoading={isLoading}
          onViewClick={(po) => setDetailModal({ open: true, poId: po.id })}
        />
      </div>

      <POFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />

      <PODetailModal
        open={detailModal.open}
        onOpenChange={(open) => setDetailModal({ open, poId: open ? detailModal.poId : null })}
        po={liveDetailPo}
      />
    </AppLayout>
  );
}