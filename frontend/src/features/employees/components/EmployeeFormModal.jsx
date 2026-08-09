import { useEffect, useState } from 'react';
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

export function EmployeeFormModal({ open, onOpenChange, employee }) {
  const isEditMode = Boolean(employee);
  const [serverError, setServerError] = useState(null);

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

  useEffect(() => {
    if (open) {
      reset(employee ?? employeeFormDefaults);
      setServerError(null);
    }
  }, [open, employee, reset]);

  const onSubmit = (formData) => {
    setServerError(null);
    if (isEditMode) {
      updateEmployee(
        { id: employee.id, updates: formData },
        {
          onSuccess: () => onOpenChange(false),
          onError: (err) => setServerError(err.message || 'Failed to update employee.'),
        }
      );
    } else {
      createEmployee(formData, {
        onSuccess: () => onOpenChange(false),
        onError: (err) => setServerError(err.message || 'Failed to add employee.'),
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Employee' : 'Add Employee'}
      description={isEditMode ? "Update this employee's details." : 'Fill in the details to add a new employee.'}
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
        <Input label="Employee Code" required error={errors.employeeCode?.message} {...register('employeeCode')} />
        <Select
          label="Status"
          required
          error={errors.status?.message}
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]}
          {...register('status')}
        />
        <Input label="First Name" required error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Last Name" required error={errors.lastName?.message} {...register('lastName')} />
        <Input label="Department" required placeholder="e.g. Assembly" error={errors.department?.message} {...register('department')} />
        <Input label="Designation" required placeholder="e.g. Line Supervisor" error={errors.designation?.message} {...register('designation')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Phone"
          type="tel"
          required
          placeholder="03XXXXXXXXX"
          maxLength={11}
          inputMode="numeric"
          error={errors.phone?.message}
          {...register('phone', {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
            },
          })}
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
        <Input label="Hire Date" type="date" required error={errors.hireDate?.message} {...register('hireDate')} />
        <Select
          label="Salary Type"
          required
          error={errors.salaryType?.message}
          options={[
            { label: 'Monthly', value: 'Monthly' },
      
          ]}
          {...register('salaryType')}
        />
        <Input label="Base Salary" type="number" step="0.01" required error={errors.baseSalary?.message} {...register('baseSalary')} />

        {serverError && (
          <p className="col-span-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-input px-3 py-2">
            {serverError}
          </p>
        )}
      </form>
    </Modal>
  );
}

EmployeeFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  employee: PropTypes.object,
};