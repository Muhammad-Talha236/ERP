import { z } from 'zod';

/**
 * createTenantSchema — validates the Super Admin's "Create Factory"
 * form, which creates BOTH the tenant record and its admin's login
 * credentials in one submission.
 */
export const createTenantSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyCode: z.string().min(1, 'Company code is required'),
  adminFirstName: z.string().min(1, "Admin's first name is required"),
  adminLastName: z.string().min(1, "Admin's last name is required"),
  adminEmail: z.string().min(1, 'Admin email is required').email('Enter a valid email address'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
});