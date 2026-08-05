import { z } from 'zod';

/**
 * employeeSchema — validation rules for the Employee create/edit form.
 *
 * FIX: previously this schema required `departmentId` and
 * `designationId` fields, but EmployeeFormModal.jsx never had
 * inputs for them — only `department` and `designation` (plain
 * text) are actually collected. Since those two phantom fields
 * could never be filled, validation ALWAYS failed silently
 * (react-hook-form blocks submit on a failed zodResolver check,
 * and no input displayed `errors.departmentId`/`errors.designationId`,
 * so nothing visibly happened when clicking "Add Employee").
 * Removed them — department/designation are stored as plain text
 * columns on the employees table, matching backend/src/models/employee.js.
 *
 * Mirrors the Validation Rules table in
 * docs/04_Database_Design_Part2.md Section 6.
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

  department: z.string().min(1, 'Department is required'),

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
  department: '',
  designation: '',
  email: '',
  phone: '',
  gender: 'Male',
  hireDate: '',
  salaryType: 'Monthly',
  baseSalary: 0,
  status: 'Active',
};