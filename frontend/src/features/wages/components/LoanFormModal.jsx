import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { useCreateLoan } from '../hooks/useLoans';

const schema = z.object({
  employeeId: z.string().min(1, 'Select an employee'),
  loanAmount: z.coerce.number().positive('Loan amount must be greater than 0'),
  startDate: z.string().min(1, 'Start date is required'),
  durationMonths: z.coerce.number().int().min(1, 'Duration must be at least 1 month'),
  reason: z.string().optional(),
});

const defaultValues = {
  employeeId: '',
  loanAmount: 0,
  startDate: new Date().toISOString().slice(0, 10),
  durationMonths: 1,
  reason: '',
};

/**
 * LoanFormModal — Monthly Installment is no longer a manual field.
 * It's computed live as loanAmount / durationMonths (rounded up to
 * the cent) and shown read-only, so the loan is guaranteed to be
 * fully recovered within the chosen duration — a typed installment
 * that didn't evenly divide the amount previously left a balance
 * uncollected after the duration had passed.
 */
export function LoanFormModal({ open, onOpenChange, employeeId }) {
  const { data: employees = [] } = useEmployees();
  const { mutate: createLoan, isPending } = useCreateLoan();

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

  const loanAmount = Number(watch('loanAmount')) || 0;
  const durationMonths = Math.max(1, Number(watch('durationMonths')) || 1);
  const computedInstallment = loanAmount > 0 ? Math.ceil((loanAmount / durationMonths) * 100) / 100 : 0;

  const onSubmit = (formData) => {
    createLoan(
      { ...formData, installmentAmount: computedInstallment },
      {
        onSuccess: () => {
          reset({ ...defaultValues, employeeId: employeeId ? String(employeeId) : '' });
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Record Loan"
      description="Monthly installments will be automatically deducted from payroll until fully recovered."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Record Loan'}
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

        <Input label="Loan Amount" type="number" step="0.01" required error={errors.loanAmount?.message} {...register('loanAmount')} />
        <Input label="Duration (months)" type="number" min="1" required error={errors.durationMonths?.message} {...register('durationMonths')} />

        <div className="col-span-2 rounded-input border border-border p-3 bg-surface/40">
          <p className="text-xs text-text-secondary">Monthly installment (auto-calculated)</p>
          <p className="text-lg font-bold text-text-primary">
            ${computedInstallment.toLocaleString(undefined, { minimumFractionDigits: 2 })}/mo
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {durationMonths} installment{durationMonths === 1 ? '' : 's'} to fully recover ${loanAmount.toLocaleString()}.
          </p>
        </div>

        <Input label="Start Date" type="date" required error={errors.startDate?.message} {...register('startDate')} />

        <div className="col-span-2">
          <Input label="Reason" placeholder="e.g. Emergency loan" error={errors.reason?.message} {...register('reason')} />
        </div>
      </form>
    </Modal>
  );
}

LoanFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  employeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};