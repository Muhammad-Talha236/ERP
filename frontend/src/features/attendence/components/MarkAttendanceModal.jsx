import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useMarkAttendance } from '../hooks/useMarkAttendance';
import { employeesMockData } from '@/mocks/data/employees.mock';

/**
 * attendanceSchema — validation for the Mark Attendance form,
 * matching business rules from docs/04_Database_Design_Part2.md:
 * check-out must be after check-in, overtime >= 0.
 */
const attendanceSchema = z
  .object({
    employeeId: z.string().min(1, 'Select an employee'),
    attendanceDate: z.string().min(1, 'Date is required'),
    status: z.enum(['Present', 'Absent', 'Leave', 'Half Day', 'Holiday']),
    checkIn: z.string().optional().or(z.literal('')),
    checkOut: z.string().optional().or(z.literal('')),
    overtimeHours: z.coerce.number().min(0, 'Overtime must be 0 or greater'),
  })
  .refine(
    (data) => !data.checkIn || !data.checkOut || data.checkOut > data.checkIn,
    { message: 'Check-out must be later than check-in', path: ['checkOut'] }
  );

const defaultValues = {
  employeeId: '',
  attendanceDate: '',
  status: 'Present',
  checkIn: '',
  checkOut: '',
  overtimeHours: 0,
};

/**
 * MarkAttendanceModal — form for manually recording an attendance entry.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 */
export function MarkAttendanceModal({ open, onOpenChange }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues,
  });

  const { mutate: markAttendance, isPending } = useMarkAttendance();

  const onSubmit = (formData) => {
    const employee = employeesMockData.find((e) => e.id === formData.employeeId);
    markAttendance(
      { ...formData, employeeName: `${employee.firstName} ${employee.lastName}` },
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
      title="Mark Attendance"
      description="Record an attendance entry for an employee."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : 'Mark Attendance'}
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
        <Input
          label="Date"
          type="date"
          required
          error={errors.attendanceDate?.message}
          {...register('attendanceDate')}
        />

        <Select
          label="Status"
          required
          error={errors.status?.message}
          options={[
            { label: 'Present', value: 'Present' },
            { label: 'Absent', value: 'Absent' },
            { label: 'Leave', value: 'Leave' },
            { label: 'Half Day', value: 'Half Day' },
            { label: 'Holiday', value: 'Holiday' },
          ]}
          {...register('status')}
        />
        <Input
          label="Overtime (hours)"
          type="number"
          step="0.5"
          error={errors.overtimeHours?.message}
          {...register('overtimeHours')}
        />

        <Input label="Check-in" type="time" error={errors.checkIn?.message} {...register('checkIn')} />
        <Input label="Check-out" type="time" error={errors.checkOut?.message} {...register('checkOut')} />
      </form>
    </Modal>
  );
}

MarkAttendanceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};