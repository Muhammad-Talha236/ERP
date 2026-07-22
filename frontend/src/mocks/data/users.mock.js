/**
 * users.mock.js — fake user accounts for authentication.
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password       - PLAIN TEXT here only because this
 *            is mock data for frontend development. The real backend
 *            will hash passwords with bcrypt and never expose them —
 *            this field exists only so our mock login can "verify" a
 *            password without a real server.
 * @property {'SuperAdmin'|'Admin'} role
 * @property {string|null} tenantId  - which factory this user belongs
 *            to; null for SuperAdmin, since they're platform-level
 * @property {string|null} tenantName
 */

export const usersMockData = [
  { id: 'user-superadmin', firstName: 'Ahmed', lastName: 'Raza', email: 'superadmin@erp.com', password: 'superadmin123', role: 'SuperAdmin', tenantId: null, tenantName: null },
  { id: 'user-admin-1', firstName: 'Priya', lastName: 'Menon', email: 'admin@northforge.io', password: 'admin123', role: 'Admin', tenantId: 'tenant-northforge', tenantName: 'NorthForge' },
  { id: 'user-admin-2', firstName: 'Bilal', lastName: 'Farooq', email: 'owner@apexgarments.com', password: 'apex123', role: 'Admin', tenantId: 'tenant-apex', tenantName: 'Apex Garments Ltd' },
  { id: 'user-admin-3', firstName: 'Ayesha', lastName: 'Malik', email: 'contact@vanguardstitch.com', password: 'vanguard123', role: 'Admin', tenantId: 'tenant-vanguard', tenantName: 'Vanguard Stitching' },
];