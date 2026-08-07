import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConsumptionChart } from './components/ConsumptionChart';
import { RecentEntriesTable } from './components/RecentEntriesTable';
import { UsageEntryFormModal } from './components/UsageEntryFormModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useDailyUsage } from './hooks/useDailyUsage';
import { useUpdateDailyUsage } from './hooks/useUpdateDailyUsage';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function DailyUsagePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null); // Date group
  const [selectedEntryId, setSelectedEntryId] = useState('');
  const [qty, setQty] = useState('');
  const [remarks, setRemarks] = useState('');

  const { data: entries, isLoading, isError, refetch } = useDailyUsage();
  const { mutate: updateUsage, isPending } = useUpdateDailyUsage();

  const handleEditClick = (groupData) => {
    setEditingGroup(groupData);
    if (groupData.entries && groupData.entries.length > 0) {
      const first = groupData.entries[0];
      setSelectedEntryId(first.id);
      setQty(first.quantityUsed || first.quantity_used || '');
      setRemarks(first.remarks || '');
    }
  };

  const handleMaterialChange = (entryId) => {
    setSelectedEntryId(entryId);
    const found = editingGroup?.entries.find((e) => String(e.id) === String(entryId));
    if (found) {
      setQty(found.quantityUsed || found.quantity_used || '');
      setRemarks(found.remarks || '');
    }
  };

  const handleSave = () => {
    if (!selectedEntryId) return;
    updateUsage(
      { 
        id: selectedEntryId, 
        updates: { quantityUsed: Number(qty), remarks } 
      },
      {
        onSuccess: () => {
          setEditingGroup(null);
          refetch();
        },
      }
    );
  };

  if (isError) {
    return (
      <AppLayout title="Daily Usage" subtitle="Material consumption trends">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Daily Usage" subtitle="Material consumption trends">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>+ Record Usage</Button>
        </div>

        <ConsumptionChart entries={entries ?? []} />

        <RecentEntriesTable 
          entries={entries ?? []} 
          isLoading={isLoading} 
          onEditClick={handleEditClick} 
        />
      </div>

      <UsageEntryFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* Edit Modal with Material Selector */}
      <Modal
        open={Boolean(editingGroup)}
        onOpenChange={(open) => !open && setEditingGroup(null)}
        title="Edit Material Usage"
        description="Select a material from this date entry to update its quantity."
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingGroup(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Select Material"
            value={selectedEntryId}
            onChange={(e) => handleMaterialChange(e.target.value)}
            options={(editingGroup?.entries ?? []).map((item) => ({
              label: `${item.materialName || item.material_name || item.category || 'Material'} (Qty: ${item.quantityUsed || item.quantity_used})`,
              value: String(item.id),
            }))}
          />
          <Input
            label="Quantity Used"
            type="number"
            step="0.01"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <Input
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional note"
          />
        </div>
      </Modal>
    </AppLayout>
  );
}