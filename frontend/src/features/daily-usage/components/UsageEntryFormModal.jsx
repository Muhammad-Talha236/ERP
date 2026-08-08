
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateDailyUsage } from '../hooks/useDailyUsage';
import { useMaterials } from '@/features/materials/hooks/useMaterials';

export function UsageEntryFormModal({ open, onOpenChange }) {
  const [materialId, setMaterialId] = useState('');
  const [quantityUsed, setQuantityUsed] = useState('');
  const [usageDate, setUsageDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: materials = [] } = useMaterials();
  const { mutate: createUsage, isPending } = useCreateDailyUsage();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!materialId || !quantityUsed || !usageDate) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    createUsage(
      {
        materialId,
        quantityUsed: Number(quantityUsed),
        usageDate,
        remarks,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setMaterialId('');
          setQuantityUsed('');
          setUsageDate(new Date().toISOString().split('T')[0]);
          setRemarks('');
        },
        onError: (err) => {
          setErrorMsg(err.message || 'Failed to save record.');
        },
      }
    );
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Record Daily Material Usage" description="Log material consumption and automatically update stock.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Material"
          required
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          options={[
            { label: 'Select material...', value: '' },
            ...materials.map((m) => ({
              label: `${m.materialName} (Stock: ${m.currentStock} ${m.unit})`,
              value: m.id,
            })),
          ]}
        />

        <Input
          label="Usage Date"
          type="date"
          required
          value={usageDate}
          onChange={(e) => setUsageDate(e.target.value)}
        />

        <Input
          label="Quantity Used"
          type="number"
          min="0.01"
          step="any"
          required
          value={quantityUsed}
          onChange={(e) => setQuantityUsed(e.target.value)}
          placeholder="e.g. 50"
        />

  

        {errorMsg && <p className="text-xs text-danger font-medium">{errorMsg}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
