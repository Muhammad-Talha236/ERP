import { useEffect, useMemo, useState } from 'react';
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
  basicPay: z.coerce.number().min(0, 'Basic pay must be 0 or greater'),
  allowances: z.coerce.number().min(0).optional(),
  bonuses: z.coerce.number().min(0).optional(),
  otherEarnings: z.coerce.number().min(0).optional(),
  otherDeductions: z.coerce.number().min(0).optional(),
  overtimeRate: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

const today = new Date();

function buildDefaults({ initialEmployeeId, initialPeriodStart, initialPeriodEnd, basicPay } = {}) {
  return {
    employeeId: initialEmployeeId ? String(initialEmployeeId) : '',
    payPeriodStart: initialPeriodStart || format(startOfMonth(today), 'yyyy-MM-dd'),
    payPeriodEnd: initialPeriodEnd || format(endOfMonth(today), 'yyyy-MM-dd'),
    basicPay: basicPay ?? 0,
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
 * IMPORTANT: attendance is no longer used to auto-calculate pay.
 * Present / Absent / Leave day counts for the period are fetched and
 * shown as READ-ONLY information so the admin can see the picture —
 * but the admin always types the actual "Basic Pay" themselves. The
 * field defaults to the employee's base salary as a starting point
 * only; the admin can raise or lower it based on attendance.
 *
 * Overtime hours are still pulled from Attendance (read-only display)
 * since that's a straightforward hours x rate calculation, not a
 * judgment call — the admin only sets the $/hour rate.
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults({ initialEmployeeId, initialPeriodStart, initialPeriodEnd }),
  });

  useEffect(() => {
    if (open) {
      const emp = initialEmployeeId
        ? employees.find((e) => String(e.id) === String(initialEmployeeId))
        : null;
      reset(buildDefaults({
        initialEmployeeId,
        initialPeriodStart,
        initialPeriodEnd,
        basicPay: emp ? Number(emp.baseSalary || 0) : 0,
      }));
      setServerError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialEmployeeId, initialPeriodStart, initialPeriodEnd, reset]);

  const employeeId = watch('employeeId');
  const payPeriodStart = watch('payPeriodStart');
  const overtimeRate = watch('overtimeRate');

  const selectedEmployee = useMemo(
    () => employees.find((e) => String(e.id) === String(employeeId)),
    [employees, employeeId]
  );

  // When the admin picks/changes the employee from the dropdown,
  // pre-fill Basic Pay with that employee's base salary. Still fully
  // editable afterward — this is just a sensible starting point.
  const handleEmployeeChange = (e) => {
    const id = e.target.value;
    setValue('employeeId', id);
    const emp = employees.find((emp) => String(emp.id) === String(id));
    setValue('basicPay', emp ? Number(emp.baseSalary || 0) : 0);
  };

  const periodDate = payPeriodStart ? new Date(payPeriodStart) : today;

  // Pull the whole tenant's attendance for this month, then filter to
  // the selected employee — purely for the informational summary below.
  const { data: attendanceRecords } = useAttendance({
    month: periodDate.getMonth() + 1,
    year: periodDate.getFullYear(),
  });

  const employeeAttendance = employeeId
    ? (attendanceRecords ?? []).filter((r) => String(r.employeeId) === String(employeeId))
    : [];

  const presentDays = employeeAttendance.filter((r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Half Day').length;
  const absentDays = employeeAttendance.filter((r) => r.status === 'Absent').length;
  const leaveDays = employeeAttendance.filter((r) => r.status === 'Leave').length;
  const overtimeHours = employeeAttendance.reduce((sum, r) => sum + Number(r.overtimeHours || 0), 0);
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
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Payroll'}
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
            value={employeeId}
            onChange={handleEmployeeChange}
          />
        </div>

        <Input label="Pay Period Start" type="date" required error={errors.payPeriodStart?.message} {...register('payPeriodStart')} />
        <Input label="Pay Period End" type="date" required error={errors.payPeriodEnd?.message} {...register('payPeriodEnd')} />

        {/* Attendance summary — informational only, nothing here auto-calculates pay */}
        <div className="col-span-2 rounded-input border border-border p-4 bg-surface/40">
          <p className="text-sm font-semibold text-text-primary mb-3">Attendance this period</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-text-secondary mb-1">Present</p>
              <p className="text-lg font-bold text-success">{employeeId ? presentDays : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Absent</p>
              <p className="text-lg font-bold text-danger">{employeeId ? absentDays : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">Leave</p>
              <p className="text-lg font-bold text-warning">{employeeId ? leaveDays : '—'}</p>
            </div>
          </div>
        
        </div>

        <div className="col-span-2">
          <Input
            label="Basic Pay"
            type="number"
            step="0.01"
            required
            error={errors.basicPay?.message}
            {...register('basicPay')}
          />
        </div>

        <Input label="Allowances" type="number" step="0.01" error={errors.allowances?.message} {...register('allowances')} />
        <Input label="Bonuses" type="number" step="0.01" error={errors.bonuses?.message} {...register('bonuses')} />
        <Input label="Other Earnings" type="number" step="0.01" error={errors.otherEarnings?.message} {...register('otherEarnings')} />
        <Input label="Other Deductions" type="number" step="0.01" error={errors.otherDeductions?.message} {...register('otherDeductions')} />

        <div className="col-span-2 rounded-input border border-border p-4 bg-surface/40">
          <p className="text-sm font-semibold text-text-primary mb-3">Overtime</p>
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <p className="text-xs text-text-secondary mb-1"></p>
              <p className="text-lg font-bold text-text-primary">
                {employeeId ? overtimeHours.toFixed(1) : '—'}
                <span className="text-xs font-normal text-text-secondary ml-1">hr</span>
              </p>
            </div>
            <Input
              label=""
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