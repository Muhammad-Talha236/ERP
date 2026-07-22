/**
 * tenants.mock.js — factories registered on the platform.
 *
 * @typedef {Object} Tenant
 * @property {string} id
 * @property {string} companyName
 * @property {string} companyCode
 * @property {string} email
 * @property {'Active'|'Suspended'|'Inactive'} status
 * @property {string} createdAt
 * @property {number} employeeCount
 * @property {string} adminUserId    - FK to the User who is this tenant's Factory Admin
 */

export const tenantsMockData = [
  { id: 'tenant-northforge', companyName: 'NorthForge', companyCode: 'NF001', email: 'admin@northforge.io', status: 'Active', createdAt: '2025-11-01', employeeCount: 8, adminUserId: 'user-admin-1' },
  { id: 'tenant-apex', companyName: 'Apex Garments Ltd', companyCode: 'APX001', email: 'owner@apexgarments.com', status: 'Active', createdAt: '2026-01-15', employeeCount: 34, adminUserId: 'user-admin-2' },
  { id: 'tenant-vanguard', companyName: 'Vanguard Stitching', companyCode: 'VNG001', email: 'contact@vanguardstitch.com', status: 'Suspended', createdAt: '2026-03-10', employeeCount: 12, adminUserId: 'user-admin-3' },
];