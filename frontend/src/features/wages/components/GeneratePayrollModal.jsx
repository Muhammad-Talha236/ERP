import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { useAttendance } from '@/features/attendence/hooks/useAttendance';
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
  overtimeRate: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

const today = new Date();

function buildDefaults({ initialEmployeeId, initialPeriodStart, initialPeriodEnd } = {}) {
  return {
    employeeId: initialEmployeeId ? String(initialEmployeeId) : '',
    payPeriodStart: initialPeriodStart || format(startOfMonth(today), 'yyyy-MM-dd'),
    payPeriodEnd: initialPeriodEnd || format(endOfMonth(today), 'yyyy-MM-dd'),
    allowances: 0,
    bonuses: 0,
    otherEarnings: 0,
    otherDeductions: 0,
    overtimeRate: 0,
    notes: '',
  };
}

/**
 * GeneratePayrollModal — the "Generate Payroll" entry point.
 *
 * Overtime is NOT typed in manually: hours are pulled straight from
 * Attendance for the selected employee/period (read-only display).
 * The admin only sets a $/hour rate — overtime pay = hours x rate is
 * computed live here and sent to the backend, which runs the exact
 * same calculation server-side.
 */
export function GeneratePayrollModal({ open, onOpenChange, initialEmployeeId, initialPeriodStart, initialPeriodEnd }) {
  const [serverError, setServerError] = useState(null);
  const { data: employees = [] } = useEmployees();
  const { mutate: generate, isPending } = useGeneratePayroll();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults({ initialEmployeeId, initialPeriodStart, initialPeriodEnd }),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaults({ initialEmployeeId, initialPeriodStart, initialPeriodEnd }));
      setServerError(null);
    }
  }, [open, initialEmployeeId, initialPeriodStart, initialPeriodEnd, reset]);

  const employeeId = watch('employeeId');
  const payPeriodStart = watch('payPeriodStart');
  const overtimeRate = watch('overtimeRate');

  const periodDate = payPeriodStart ? new Date(payPeriodStart) : today;

  // Pull the whole tenant's attendance for this month, then filter to
  // the selected employee — reuses the existing Attendance API as-is,
  // no changes to that module needed.
  const { data: attendanceRecords } = useAttendance({
    month: periodDate.getMonth() + 1,
    year: periodDate.getFullYear(),
  });

  const overtimeHours = employeeId
    ? (attendanceRecords ?? [])
        .filter((r) => String(r.employeeId) === String(employeeId))
        .reduce((sum, r) => sum + Number(r.overtimeHours || 0), 0)
    : 0;
  const overtimeAmount = Number((overtimeHours * Number(overtimeRate || 0)).toFixed(2));

  const onSubmit = (formData) => {
    setServerError(null);
    generate(formData, {
      onSuccess: () => {
        reset(buildDefaults());
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

        <div className="col-span-2 rounded-input border border-border p-4 bg-surface/40">
          <p className="text-sm font-semibold text-text-primary mb-3">Overtime</p>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <p className="text-xs text-text-secondary mb-1">Overtime hours (this period)</p>
              <p className="text-lg font-bold text-text-primary">
                {employeeId ? overtimeHours.toFixed(1) : '—'}
                <span className="text-xs font-normal text-text-secondary ml-1">hrs</span>
              </p>
            </div>
            <Input
              label="Overtime Rate ($/hour)"
              type="number"
              step="0.01"
              min="0"
              error={errors.overtimeRate?.message}
              {...register('overtimeRate')}
            />
            <div>
              <p className="text-xs text-text-secondary mb-1">Overtime pay</p>
              <p className="text-lg font-bold text-success">${overtimeAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

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
  initialEmployeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialPeriodStart: PropTypes.string,
  initialPeriodEnd: PropTypes.string,
};