import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { useCreateAdvance } from '../hooks/useAdvances';

const schema = z
  .object({
    employeeId: z.string().min(1, 'Select an employee'),
    amount: z.coerce.number().positive('Amount must be greater than 0'),
    advanceDate: z.string().min(1, 'Date is required'),
    reason: z.string().optional(),
    recoveryType: z.enum(['Full', 'Installment']),
    installmentAmount: z.coerce.number().min(0).optional(),
  })
  .refine((data) => data.recoveryType !== 'Installment' || Number(data.installmentAmount) > 0, {
    message: 'Installment amount is required',
    path: ['installmentAmount'],
  });

const defaultValues = {
  employeeId: '',
  amount: 0,
  advanceDate: new Date().toISOString().slice(0, 10),
  reason: '',
  recoveryType: 'Full',
  installmentAmount: 0,
};

export function AdvanceFormModal({ open, onOpenChange, employeeId }) {
  const { data: employees = [] } = useEmployees();
  const { mutate: createAdvance, isPending } = useCreateAdvance();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues, employeeId: employeeId ? String(employeeId) : '' },
  });

  const recoveryType = watch('recoveryType');

  const onSubmit = (formData) => {
    createAdvance(formData, {
      onSuccess: () => {
        reset({ ...defaultValues, employeeId: employeeId ? String(employeeId) : '' });
        onOpenChange(false);
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Record Advance"
      description="This advance will be automatically deducted from future payroll."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Record Advance'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        {!employeeId && (
          <div className="col-span-2">
            <Select
              label="Employee"
              required
              error={errors.employeeId?.message}
              options={[
                { label: 'Select employee', value: '' },
                ...employees.map((e) => ({ label: `${e.firstName} ${e.lastName}`, value: String(e.id) })),
              ]}
              {...register('employeeId')}
            />
          </div>
        )}

        <Input label="Amount" type="number" step="0.01" required error={errors.amount?.message} {...register('amount')} />
        <Input label="Date" type="date" required error={errors.advanceDate?.message} {...register('advanceDate')} />

        <Select
          label="Recovery Type"
          required
          options={[
            { label: 'Full (next payroll)', value: 'Full' },
            { label: 'Installments', value: 'Installment' },
          ]}
          {...register('recoveryType')}
        />
        {recoveryType === 'Installment' && (
          <Input
            label="Installment Amount"
            type="number"
            step="0.01"
            required
            error={errors.installmentAmount?.message}
            {...register('installmentAmount')}
          />
        )}

        <div className="col-span-2">
          <Input label="Reason" placeholder="e.g. Personal expense" error={errors.reason?.message} {...register('reason')} />
        </div>
      </form>
    </Modal>
  );
}

AdvanceFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  employeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};