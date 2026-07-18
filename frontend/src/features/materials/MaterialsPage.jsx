import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { LowStockBanner } from './components/LowStockBanner';
import { MaterialGrid } from './components/MaterialGrid';
import { MaterialFormModal } from './components/MaterialFormModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useMaterials } from './hooks/useMaterials';

/**
 * MaterialsPage — the main "Materials" screen: low-stock banner,
 * inventory header with item count and "Add Material" action, and
 * the responsive material card grid.
 */
export function MaterialsPage() {
  const [formModal, setFormModal] = useState({ open: false, material: null });

  const { data: materials, isLoading, isError, refetch } = useMaterials();

  const handleAddClick = () => setFormModal({ open: true, material: null });
  const handleCardClick = (material) => setFormModal({ open: true, material });

  return (
    <AppLayout title="Materials" subtitle="Inventory & suppliers">
      <div className="space-y-6">
        {!isLoading && materials && (
          <LowStockBanner materials={materials} onReorderClick={handleAddClick} />
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Inventory</h2>
            <p className="text-sm text-text-secondary">
              {materials ? `${materials.length} items tracked` : 'Loading...'}
            </p>
          </div>
          <Button onClick={handleAddClick}>+ Add Material</Button>
        </div>

        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <MaterialGrid materials={materials} isLoading={isLoading} onCardClick={handleCardClick} />
        )}
      </div>

      <MaterialFormModal
        open={formModal.open}
        onOpenChange={(open) => setFormModal({ open, material: open ? formModal.material : null })}
        material={formModal.material}
      />
    </AppLayout>
  );
}