import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateMaterial } from '../hooks/useCreateMaterial';
import { useUpdateMaterial } from '../hooks/useUpdateMaterial';

/**
 * materialSchema — validation matching docs/04_Database_Design_Part2.md
 * Section 14 & 17 Validation Rules: material code required/unique,
 * stock/price >= 0.
 */
const materialSchema = z.object({
  materialCode: z.string().min(1, 'Material code is required'),
  materialName: z.string().min(1, 'Material name is required'),
  category: z.string().min(1, 'Category is required'),
  unit: z.enum(['Meter', 'Piece', 'Kg', 'Roll', 'Box']),
  currentStock: z.coerce.number().min(0, 'Stock must be 0 or greater'),
  minimumStock: z.coerce.number().min(0, 'Minimum stock must be 0 or greater'),
  purchasePrice: z.coerce.number().min(0, 'Price must be 0 or greater'),
  supplierName: z.string().min(1, 'Supplier is required'),
  status: z.enum(['Active', 'Inactive']),
});

const defaultValues = {
  materialCode: '',
  materialName: '',
  category: '',
  unit: 'Piece',
  currentStock: 0,
  minimumStock: 0,
  purchasePrice: 0,
  supplierName: '',
  status: 'Active',
};

/**
 * MaterialFormModal — Add/Edit Material form.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Material} [props.material] - present when editing
 */
export function MaterialFormModal({ open, onOpenChange, material }) {
  const isEditMode = Boolean(material);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues,
  });

  const { mutate: createMaterial, isPending: isCreating } = useCreateMaterial();
  const { mutate: updateMaterial, isPending: isUpdating } = useUpdateMaterial();
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      reset(material ?? defaultValues);
    }
  }, [open, material, reset]);

  const onSubmit = (formData) => {
    if (isEditMode) {
      updateMaterial(
        { id: material.id, updates: formData },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMaterial(formData, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Material' : 'Add Material'}
      description={
        isEditMode ? 'Update this material\'s details.' : 'Fill in the details to add a new material.'
      }
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Material'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <Input
          label="Material Code"
          required
          error={errors.materialCode?.message}
          {...register('materialCode')}
        />
        <Input
          label="Material Name"
          required
          error={errors.materialName?.message}
          {...register('materialName')}
        />

        <Input
          label="Category"
          required
          placeholder="e.g. Metal, Plastic"
          error={errors.category?.message}
          {...register('category')}
        />
        <Select
          label="Unit"
          required
          error={errors.unit?.message}
          options={[
            { label: 'Piece', value: 'Piece' },
            { label: 'Meter', value: 'Meter' },
            { label: 'Kg', value: 'Kg' },
            { label: 'Roll', value: 'Roll' },
            { label: 'Box', value: 'Box' },
          ]}
          {...register('unit')}
        />

        <Input
          label="Current Stock"
          type="number"
          required
          error={errors.currentStock?.message}
          {...register('currentStock')}
        />
        <Input
          label="Minimum Stock"
          type="number"
          required
          error={errors.minimumStock?.message}
          {...register('minimumStock')}
        />

        <Input
          label="Purchase Price"
          type="number"
          step="0.01"
          required
          error={errors.purchasePrice?.message}
          {...register('purchasePrice')}
        />
        <Input
          label="Supplier"
          required
          error={errors.supplierName?.message}
          {...register('supplierName')}
        />

        <Select
          label="Status"
          required
          error={errors.status?.message}
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]}
          {...register('status')}
        />
      </form>
    </Modal>
  );
}

MaterialFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  material: PropTypes.object,
};