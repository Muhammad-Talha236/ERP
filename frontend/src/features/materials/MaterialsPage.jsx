import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LowStockBanner } from './components/LowStockBanner';
import { MaterialGrid } from './components/MaterialGrid';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useMaterials } from './hooks/useMaterials';
import { POFormModal } from '@/features/stockOrder/components/POFormModal';

export function MaterialsPage() {
  const { data: materials, isLoading, isError, refetch } = useMaterials();
  const [isPOFormOpen, setIsPOFormOpen] = useState(false);
  const [reorderItems, setReorderItems] = useState([]);

  // Jab Reorder button par click ho
  const handleReorderClick = (lowMaterials) => {
    // Low stock materials ko PO form ke items format mein map kar rahe hain
    const itemsToOrder = lowMaterials.map((m) => ({
      materialName: m.materialName,
      quantity: Math.max(1, (m.minimumStock * 2) - m.currentStock), // Deficit quantity calculate ki hai
      unitPrice: m.purchasePrice || 0,
    }));
    setReorderItems(itemsToOrder);
    setIsPOFormOpen(true);
  };

  return (
    <AppLayout title="Materials" subtitle="Inventory & stock tracking">
      <div className="space-y-6">
        {!isLoading && materials && (
          <LowStockBanner materials={materials} onReorderClick={handleReorderClick} />
        )}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Inventory</h2>
            <p className="text-sm text-text-secondary">
              {materials ? `${materials.length} items tracked via Stock Orders` : 'Loading...'}
            </p>
          </div>
        </div>
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <MaterialGrid materials={materials} isLoading={isLoading} />
        )}
      </div>

      {/* Stock Order / PO Form Modal with pre-filled low stock items */}
      <POFormModal
        open={isPOFormOpen}
        onOpenChange={setIsPOFormOpen}
        initialItems={reorderItems}
      />
    </AppLayout>
  );
}