import { z } from 'zod';

/**
 * employeeSchema — validation rules for the Employee create/edit form.
 *
 * Mirrors the Validation Rules table in
 * docs/04_Database_Design_Part2.md Section 6, so frontend validation
 * and (eventually) backend validation stay in agreement.
 *
 * Used by:
 *  - EmployeeFormModal.jsx (via @hookform/resolvers/zod)
 *  - Could also validate mock data shape in tests later
 */
export const employeeSchema = z.object({
  employeeCode: z
    .string()
    .min(1, 'Employee code is required')
    .max(30, 'Employee code must be 30 characters or fewer'),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or fewer'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or fewer'),

  departmentId: z.string().min(1, 'Department is required'),
  department: z.string().min(1, 'Department is required'),

  designationId: z.string().min(1, 'Designation is required'),
  designation: z.string().min(1, 'Designation is required'),

  email: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .min(1, 'Phone number is required'),

  gender: z.enum(['Male', 'Female', 'Other'], {
    errorMap: () => ({ message: 'Select a gender' }),
  }),

  hireDate: z
    .string()
    .min(1, 'Hire date is required')
    .refine((date) => new Date(date) <= new Date(), {
      message: 'Hire date cannot be in the future',
    }),

  salaryType: z.enum(['Daily', 'Monthly', 'Piece Rate'], {
    errorMap: () => ({ message: 'Select a salary type' }),
  }),

  baseSalary: z.coerce
    .number()
    .min(0, 'Salary must be 0 or greater'),

  status: z.enum(['Active', 'Inactive', 'On Leave']),
});

/**
 * Default values for a NEW employee form (create mode).
 * EmployeeFormModal spreads an existing employee over these when
 * editing, or uses these as-is when adding a new one.
 */
export const employeeFormDefaults = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  departmentId: '',
  department: '',
  designationId: '',
  designation: '',
  email: '',
  phone: '',
  gender: 'Male',
  hireDate: '',
  salaryType: 'Monthly',
  baseSalary: 0,
  status: 'Active',
};