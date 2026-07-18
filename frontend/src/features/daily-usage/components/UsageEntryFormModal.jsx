import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateUsageEntry } from '../hooks/useCreateUsageEntry';
import { employeesMockData } from '@/mocks/data/employees.mock';
import { materialsMockData } from '@/mocks/data/materials.mock';

/**
 * usageEntrySchema — validates the "assign consumable" form.
 * Quantity must be greater than zero per
 * docs/04_Database_Design_Part2.md Section 19 Validation Rules.
 */
const usageEntrySchema = z.object({
  employeeId: z.string().min(1, 'Select an employee'),
  materialId: z.string().min(1, 'Select a material'),
  usageDate: z.string().min(1, 'Date is required'),
  quantityUsed: z.coerce.number().positive('Quantity must be greater than 0'),
  wastageQuantity: z.coerce.number().min(0, 'Wastage must be 0 or greater'),
  remarks: z.string().optional(),
});

const defaultValues = {
  employeeId: '',
  materialId: '',
  usageDate: '',
  quantityUsed: 0,
  wastageQuantity: 0,
  remarks: '',
};

/**
 * UsageEntryFormModal — form for assigning/recording material
 * consumption by an employee.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function UsageEntryFormModal({ open, onOpenChange }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usageEntrySchema),
    defaultValues,
  });

  const { mutate: createEntry, isPending } = useCreateUsageEntry();

  const onSubmit = (formData) => {
    const employee = employeesMockData.find((e) => e.id === formData.employeeId);
    const material = materialsMockData.find((m) => m.id === formData.materialId);

    createEntry(
      {
        ...formData,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        materialName: material.materialName,
        materialCategory: material.category.toLowerCase(),
        unit: material.unit,
      },
      {
        onSuccess: () => {
          reset(defaultValues);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Record Material Usage"
      description="Assign consumables used by an employee during production."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Record Usage'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <Select
          label="Employee"
          required
          error={errors.employeeId?.message}
          options={[
            { label: 'Select employee', value: '' },
            ...employeesMockData.map((e) => ({
              label: `${e.firstName} ${e.lastName}`,
              value: e.id,
            })),
          ]}
          {...register('employeeId')}
        />
        <Select
          label="Material"
          required
          error={errors.materialId?.message}
          options={[
            { label: 'Select material', value: '' },
            ...materialsMockData.map((m) => ({
              label: `${m.materialName} (${m.currentStock} ${m.unit} available)`,
              value: m.id,
            })),
          ]}
          {...register('materialId')}
        />

        <Input
          label="Date"
          type="date"
          required
          error={errors.usageDate?.message}
          {...register('usageDate')}
        />
        <Input
          label="Quantity Used"
          type="number"
          step="0.1"
          required
          error={errors.quantityUsed?.message}
          {...register('quantityUsed')}
        />

        <Input
          label="Wastage"
          type="number"
          step="0.1"
          error={errors.wastageQuantity?.message}
          {...register('wastageQuantity')}
        />
        <Input
          label="Remarks"
          placeholder="Optional notes"
          error={errors.remarks?.message}
          {...register('remarks')}
        />
      </form>
    </Modal>
  );
}

UsageEntryFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};