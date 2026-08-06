import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateLeaveRequest } from '../hooks/useCreateLeaveRequest';
import { useUpdateLeaveRequest } from '../hooks/useUpdateLeaveRequest';
import { useEmployees } from '@/features/employees/hooks/useEmployees'; // Employees fetch karne ke liye

const leaveRequestSchema = z.object({
  employeeId: z.string().min(1, 'Select an employee'),
  leaveType: z.string().min(1, 'Leave type is required'),
  fromDate: z.string().min(1, 'From date is required'),
  toDate: z.string().min(1, 'To date is required'),
  reason: z.string().optional(),
})
.refine((data) => {
  // Check karein ke toDate, fromDate ke baad ya barabar honi chahiye
  if (data.fromDate && data.toDate) {
    return data.toDate >= data.fromDate;
  }
  return true;
}, {
  message: 'To date cannot be earlier than From date',
  path: ['toDate'],
})
.refine((data) => {
  // Check karein ke fromDate aaj ya uske baad ki honi chahiye (past dates allow nahi hain)
  if (data.fromDate) {
    const today = new Date().toISOString().split('T')[0];
    return data.fromDate >= today;
  }
  return true;
}, {
  message: 'Leave date cannot be in the past',
  path: ['fromDate'],
});

export function LeaveRequestModal({ open, onOpenChange, editData = null }) {
  const { data: employees } = useEmployees();
  
  const { mutate: createRequest, isPending: isCreating } = useCreateLeaveRequest();
  const { mutate: updateRequest, isPending: isUpdating } = useUpdateLeaveRequest();
  
  const isPending = isCreating || isUpdating;
  const isEditMode = !!editData;

  const buildDefaults = () => ({
    employeeId: '',
    leaveType: 'Sick leave',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: buildDefaults(),
  });

  // SIRF ACTIVE EMPLOYEES KO FILTER KARNA
  const activeEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter((e) => e.status !== 'Inactive');
  }, [employees]);

  useEffect(() => {
    if (open) {
      if (editData) {
        reset({
          employeeId: String(editData.employeeId),
          leaveType: editData.type || 'Sick leave',
          fromDate: editData.fromDate || '',
          toDate: editData.toDate || '',
          reason: editData.reason || '',
        });
      } else {
        reset(buildDefaults());
      }
    }
  }, [open, editData, reset]);

  const onSubmit = (formData) => {
    if (isEditMode) {
      updateRequest(
        { id: editData.id, updates: formData },
        {
          onSuccess: () => {
            reset(buildDefaults());
            onOpenChange(false);
          },
        }
      );
    } else {
      createRequest(formData, {
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
      title={isEditMode ? "Edit Leave Request" : "New Leave Request"}
      description={isEditMode ? "Update leave request details." : "Submit a leave request for an active employee."}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Submit Request')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
          <Select
            label="Employee"
            required
            disabled={isEditMode} // Edit mode mein employee change nahi ho sakay ga
            error={errors.employeeId?.message}
            options={[
              { label: 'Select employee', value: '' },
              ...activeEmployees.map((e) => ({
                label: `${e.firstName} ${e.lastName}`,
                value: String(e.id),
              })),
            ]}
            {...register('employeeId')}
          />
        </div>

        <div className="col-span-2">
          <Select
            label="Leave Type"
            required
            error={errors.leaveType?.message}
            options={[
              { label: 'Sick leave', value: 'Sick leave' },
              { label: 'Personal leave', value: 'Personal leave' },
              { label: 'Annual leave', value: 'Annual leave' },
              { label: 'Casual leave', value: 'Casual leave' },
            ]}
            {...register('leaveType')}
          />
        </div>
        
        <Input
          label="From Date"
          type="date"
          required
          error={errors.fromDate?.message}
          {...register('fromDate')}
        />

        <Input
          label="To Date"
          type="date"
          required
          error={errors.toDate?.message}
          {...register('toDate')}
        />
        
        <div className="col-span-2">
          <Input 
            label="Reason" 
            placeholder="Optional note" 
            error={errors.reason?.message} 
            {...register('reason')} 
          />
        </div>
      </form>
    </Modal>
  );
}

LeaveRequestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  editData: PropTypes.object,
};