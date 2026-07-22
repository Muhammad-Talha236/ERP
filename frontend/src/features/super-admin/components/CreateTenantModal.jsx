import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createTenantSchema } from '../schemas/tenant.schema';
import { useCreateTenant } from '../hooks/useCreateTenant';

const defaultValues = {
  companyName: '',
  companyCode: '',
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  adminPassword: '',
};

/**
 * CreateTenantModal — Super Admin's "New Factory" form. Creates the
 * factory record AND its admin's login credentials together, since
 * per business rules every tenant must have exactly one primary
 * administrator from the moment it's created — there's no
 * intermediate "factory with no admin" state.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function CreateTenantModal({ open, onOpenChange }) {
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createTenantSchema), defaultValues });

  const { mutate: createTenant, isPending } = useCreateTenant();

  const onSubmit = (formData) => {
    setServerError(null);
    createTenant(formData, {
      onSuccess: () => {
        reset(defaultValues);
        onOpenChange(false);
      },
      onError: (err) => setServerError(err.message || 'Failed to create factory.'),
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New Factory"
      description="Create a factory account and its primary administrator."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Factory'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3">Factory Details</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              required
              placeholder="e.g. Apex Garments Ltd"
              error={errors.companyName?.message}
              {...register('companyName')}
            />
            <Input
              label="Company Code"
              required
              placeholder="e.g. APX001"
              error={errors.companyCode?.message}
              {...register('companyCode')}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm font-semibold text-text-primary mb-3">Primary Administrator</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              error={errors.adminFirstName?.message}
              {...register('adminFirstName')}
            />
            <Input
              label="Last Name"
              required
              error={errors.adminLastName?.message}
              {...register('adminLastName')}
            />
            <div className="col-span-2">
              <Input
                label="Email"
                type="email"
                required
                placeholder="admin@factory.com"
                error={errors.adminEmail?.message}
                {...register('adminEmail')}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Password"
                type="password"
                required
                error={errors.adminPassword?.message}
                {...register('adminPassword')}
              />
            </div>
          </div>
        </div>

        {serverError && <p className="text-sm text-danger">{serverError}</p>}
      </form>
    </Modal>
  );
}