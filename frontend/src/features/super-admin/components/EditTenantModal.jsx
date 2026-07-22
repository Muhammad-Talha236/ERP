import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUpdateTenant } from '../hooks/useUpdateTenant';

/**
 * EditTenantModal — edits a factory's basic details (name/code).
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Tenant|null} props.tenant
 */
export function EditTenantModal({ open, onOpenChange, tenant }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { companyName: '', companyCode: '' },
  });

  const { mutate: updateTenant, isPending } = useUpdateTenant();

  useEffect(() => {
    if (tenant) reset({ companyName: tenant.companyName, companyCode: tenant.companyCode });
  }, [tenant, reset]);

  if (!tenant) return null;

  const onSubmit = (formData) => {
    updateTenant({ id: tenant.id, updates: formData }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit ${tenant.companyName}`}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Company Name" required {...register('companyName')} />
        <Input label="Company Code" required {...register('companyCode')} />
      </form>
    </Modal>
  );
}