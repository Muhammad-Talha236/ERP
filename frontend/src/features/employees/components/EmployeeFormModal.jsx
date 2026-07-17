import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { employeeSchema, employeeFormDefaults } from '../schemas/employee.schema';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import { useUpdateEmployee } from '../hooks/useUpdateEmployee';

/**
 * EmployeeFormModal — Add/Edit Employee form.
 *
 * Works in two modes based on whether `employee` is passed:
 *  - employee is null/undefined -> "Add Employee" (create mode)
 *  - employee is provided -> "Edit Employee" (update mode), form
 *    pre-filled with that employee's existing data
 *
 * Validation is entirely driven by employeeSchema (Zod) via
 * @hookform/resolvers/zod — react-hook-form calls the schema on
 * every submit attempt and surfaces field-level errors automatically.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Employee} [props.employee] - present when editing
 */
export function EmployeeFormModal({ open, onOpenChange, employee }) {
  const isEditMode = Boolean(employee);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: employeeFormDefaults,
  });

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee();
  const isSubmitting = isCreating || isUpdating;

  // Whenever the modal opens for a DIFFERENT employee (or opens fresh
  // for "Add"), reset the form to the right starting values. Without
  // this, editing one employee then opening "Add" would show stale
  // data from the previous edit.
  useEffect(() => {
    if (open) {
      reset(employee ?? employeeFormDefaults);
    }
  }, [open, employee, reset]);

  const onSubmit = (formData) => {
    if (isEditMode) {
      updateEmployee(
        { id: employee.id, updates: formData },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createEmployee(formData, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Employee' : 'Add Employee'}
      description={
        isEditMode ? 'Update this employee\'s details.' : 'Fill in the details to add a new employee.'
      }
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Employee'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <Input
          label="Employee Code"
          required
          error={errors.employeeCode?.message}
          {...register('employeeCode')}
        />
        <Select
          label="Status"
          required
          error={errors.status?.message}
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
            { label: 'On Leave', value: 'On Leave' },
          ]}
          {...register('status')}
        />

        <Input
          label="First Name"
          required
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          required
          error={errors.lastName?.message}
          {...register('lastName')}
        />

        <Input
          label="Department"
          required
          placeholder="e.g. Assembly"
          error={errors.department?.message}
          {...register('department')}
        />
        <Input
          label="Designation"
          required
          placeholder="e.g. Line Supervisor"
          error={errors.designation?.message}
          {...register('designation')}
        />

        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone"
          required
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Select
          label="Gender"
          required
          error={errors.gender?.message}
          options={[
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Other', value: 'Other' },
          ]}
          {...register('gender')}
        />
        <Input
          label="Hire Date"
          type="date"
          required
          error={errors.hireDate?.message}
          {...register('hireDate')}
        />

        <Select
          label="Salary Type"
          required
          error={errors.salaryType?.message}
          options={[
            { label: 'Monthly', value: 'Monthly' },
            { label: 'Daily', value: 'Daily' },
            { label: 'Piece Rate', value: 'Piece Rate' },
          ]}
          {...register('salaryType')}
        />
        <Input
          label="Base Salary"
          type="number"
          step="0.01"
          required
          error={errors.baseSalary?.message}
          {...register('baseSalary')}
        />
      </form>
    </Modal>
  );
}

EmployeeFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  employee: PropTypes.object,
};