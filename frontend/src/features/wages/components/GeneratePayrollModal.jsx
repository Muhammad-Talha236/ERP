import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { useGeneratePayroll } from '../hooks/useGeneratePayroll';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const schema = z.object({
  employeeId: z.string().min(1, 'Select an employee'),
  payPeriodStart: z.string().min(1, 'Start date is required'),
  payPeriodEnd: z.string().min(1, 'End date is required'),
  allowances: z.coerce.number().min(0).optional(),
  bonuses: z.coerce.number().min(0).optional(),
  otherEarnings: z.coerce.number().min(0).optional(),
  otherDeductions: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

const today = new Date();
const defaultValues = {
  employeeId: '',
  payPeriodStart: format(startOfMonth(today), 'yyyy-MM-dd'),
  payPeriodEnd: format(endOfMonth(today), 'yyyy-MM-dd'),
  allowances: 0,
  bonuses: 0,
  otherEarnings: 0,
  otherDeductions: 0,
  notes: '',
};

/**
 * GeneratePayrollModal — the "Generate Payroll" entry point. Runs
 * the Attendance -> Earnings -> Advance/Loan Deduction -> Net Payable
 * pipeline server-side for one employee/period and lands the result
 * as a 'Calculated' payroll row, ready for Approve -> Pay.
 */
export function GeneratePayrollModal({ open, onOpenChange }) {
  const [serverError, setServerError] = useState(null);
  const { data: employees = [] } = useEmployees();
  const { mutate: generate, isPending } = useGeneratePayroll();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues });

  const onSubmit = (formData) => {
    setServerError(null);
    generate(formData, {
      onSuccess: () => {
        reset(defaultValues);
        onOpenChange(false);
      },
      onError: (err) => setServerError(err.message || 'Failed to generate payroll.'),
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Generate Payroll"
      description="Calculates earnings and deductions from attendance, advances, and loans for one pay period."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Calculating...' : 'Calculate Payroll'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
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

        <Input label="Pay Period Start" type="date" required error={errors.payPeriodStart?.message} {...register('payPeriodStart')} />
        <Input label="Pay Period End" type="date" required error={errors.payPeriodEnd?.message} {...register('payPeriodEnd')} />

        <Input label="Allowances" type="number" step="0.01" error={errors.allowances?.message} {...register('allowances')} />
        <Input label="Bonuses" type="number" step="0.01" error={errors.bonuses?.message} {...register('bonuses')} />
        <Input label="Other Earnings" type="number" step="0.01" error={errors.otherEarnings?.message} {...register('otherEarnings')} />
        <Input label="Other Deductions" type="number" step="0.01" error={errors.otherDeductions?.message} {...register('otherDeductions')} />

        <div className="col-span-2">
          <Input label="Notes" placeholder="Optional note for this payroll run" error={errors.notes?.message} {...register('notes')} />
        </div>

        {serverError && <p className="col-span-2 text-sm text-danger">{serverError}</p>}
      </form>
    </Modal>
  );
}

GeneratePayrollModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};