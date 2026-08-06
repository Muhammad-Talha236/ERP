import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useMarkAttendance } from '../hooks/useMarkAttendance';
import { useUpdateAttendance } from '../hooks/useUpdateAttendance';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { useLeaveRequests } from '../hooks/useLeaveRequests';
import { toLocalDateString } from '../utils/dateHelpers';

const attendanceSchema = z
  .object({
    employeeId: z.string().min(1, 'Select an employee'),
    attendanceDate: z.string().min(1, 'Date is required'),
    status: z.enum(['Present', 'Absent', 'Late', 'Half Day', 'Holiday']),
    checkIn: z.string().optional().or(z.literal('')),
    checkOut: z.string().optional().or(z.literal('')),
    overtimeHours: z.coerce.number().min(0, 'Overtime must be 0 or greater'),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      // Agar status Absent ya Holiday nahi hai, toh Check-in lazmi hai
      if (data.status !== 'Absent' && data.status !== 'Holiday') {
        return Boolean(data.checkIn && data.checkIn.trim() !== '');
      }
      return true;
    },
    { message: 'Check-in time is required', path: ['checkIn'] }
  )
  .refine(
    (data) => {
      // Agar status Absent ya Holiday nahi hai, toh Check-out lazmi hai
      if (data.status !== 'Absent' && data.status !== 'Holiday') {
        return Boolean(data.checkOut && data.checkOut.trim() !== '');
      }
      return true;
    },
    { message: 'Check-out time is required', path: ['checkOut'] }
  )
  .refine(
    (data) => {
      if (data.checkIn && data.checkOut) {
        return data.checkOut > data.checkIn;
      }
      return true;
    },
    { message: 'Check-out must be later than check-in', path: ['checkOut'] }
  );

export function MarkAttendanceModal({ open, onOpenChange, initialDate, existingRecords = [], editData = null }) {
  const { data: employees } = useEmployees();
  const { data: leaveRequests } = useLeaveRequests();
  
  const { mutate: markAttendance, isPending: isCreating } = useMarkAttendance();
  const { mutate: updateAttendance, isPending: isUpdating } = useUpdateAttendance();
  
  const isPending = isCreating || isUpdating;
  const isEditMode = !!editData;

  const buildDefaults = () => ({
    employeeId: '',
    attendanceDate: initialDate || toLocalDateString(new Date()),
    status: 'Present',
    checkIn: '',
    checkOut: '',
    overtimeHours: 0,
    remarks: '',
  });

  const { register, handleSubmit, reset, watch, setError, formState: { errors } } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: buildDefaults(),
  });

  const watchedDate = watch('attendanceDate');

  // Filter out Inactive and employees on Approved Leave for the selected date
  const availableEmployees = useMemo(() => {
    if (!employees) return [];
    
    return employees.filter((e) => {
      if (e.status === 'Inactive') return false;

      const isOnLeave = (leaveRequests ?? []).some((req) => {
        return (
          String(req.employeeId) === String(e.id) &&
          req.status === 'Approved' &&
          watchedDate >= req.fromDate &&
          watchedDate <= req.toDate
        );
      });

      if (isOnLeave) return false;

      return true;
    });
  }, [employees, leaveRequests, watchedDate]);

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          employeeId: String(editData.employeeId),
          attendanceDate: editData.attendanceDate,
          status: editData.status === 'Leave' ? 'Present' : editData.status,
          checkIn: editData.checkIn || '',
          checkOut: editData.checkOut || '',
          overtimeHours: editData.overtimeHours || 0,
          remarks: editData.remarks || '',
        });
      } else {
        reset(buildDefaults());
      }
    }
  }, [open, initialDate, editData, reset]);

  const onSubmit = (formData) => {
    if (isEditMode) {
      updateAttendance(
        { id: editData.id, updates: formData },
        {
          onSuccess: () => {
            reset(buildDefaults());
            onOpenChange(false);
          },
        }
      );
    } else {
      const isAlreadyMarked = existingRecords.some(
        (record) => 
          String(record.employeeId) === String(formData.employeeId) && 
          record.attendanceDate === formData.attendanceDate
      );

      if (isAlreadyMarked) {
        setError('employeeId', {
          type: 'manual',
          message: 'Attendance already marked for this employee on this date.',
        });
        return; 
      }

      markAttendance(formData, {
        onSuccess: () => {
          reset(buildDefaults());
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Update Attendance" : "Mark Attendance"}
      description={isEditMode ? "Modify an existing attendance record." : "Record an attendance entry for an employee."}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : (isEditMode ? 'Update Record' : 'Mark Attendance')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Select
            label="Employee"
            required
            disabled={isEditMode}
            error={errors.employeeId?.message}
            options={[
              { label: 'Select employee', value: '' },
              ...availableEmployees.map((e) => ({
                label: `${e.firstName} ${e.lastName}`,
                value: String(e.id),
              })),
            ]}
            {...register('employeeId')}
          />
        </div>
        
        <Input
          label="Date"
          type="date"
          required
          disabled={isEditMode}
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
            { label: 'Late', value: 'Late' },
            { label: 'Half Day', value: 'Half Day' },
    
          ]}
          {...register('status')}
        />
        
        <Input label="Check-in" type="time" error={errors.checkIn?.message} {...register('checkIn')} />
        <Input label="Check-out" type="time" error={errors.checkOut?.message} {...register('checkOut')} />
        
        <Input
          label="Overtime (hours)"
          type="number"
          step="0.5"
          error={errors.overtimeHours?.message}
          {...register('overtimeHours')}
        />
        
        <Input label="Remarks" placeholder="Optional note" error={errors.remarks?.message} {...register('remarks')} />
      </form>
    </Modal>
  );
}

MarkAttendanceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  initialDate: PropTypes.string,
  existingRecords: PropTypes.array,
  editData: PropTypes.object,
};