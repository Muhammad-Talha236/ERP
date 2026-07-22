import { tenantsMockData } from '@/mocks/data/tenants.mock';
import { _createAdminUser, _emailExists } from './auth.mock';

const DELAY_MS = 400;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let tenants = [...tenantsMockData];

/**
 * Simulates GET /api/v1/tenants
 */
export async function fetchTenants() {
  await wait(350);
  return [...tenants];
}

/**
 * Simulates POST /api/v1/tenants
 *
 * THIS IS THE ONLY WAY a new factory + admin account gets created —
 * Super Admin provides both the factory's details AND its admin's
 * login credentials in one step. There is no public signup; this
 * mirrors docs/02-business-requirements.md: "Super Admin: Create
 * factory accounts" and "Every tenant has one primary administrator."
 *
 * @param {{ companyName, companyCode, adminFirstName, adminLastName, adminEmail, adminPassword }} formData
 * @returns {Promise<Tenant>}
 */
export async function createTenant(formData) {
  await wait(DELAY_MS);

  if (_emailExists(formData.adminEmail)) {
    throw new Error('An admin account with this email already exists.');
  }

  const tenantId = `tenant-${Date.now()}`;

  const tenant = {
    id: tenantId,
    companyName: formData.companyName,
    companyCode: formData.companyCode,
    email: formData.adminEmail,
    status: 'Active',
    createdAt: new Date().toISOString().slice(0, 10),
    employeeCount: 0,
    adminUserId: null, // set below once the admin user is created
  };

  const adminUser = _createAdminUser({
    firstName: formData.adminFirstName,
    lastName: formData.adminLastName,
    email: formData.adminEmail,
    password: formData.adminPassword,
    tenantId,
    tenantName: formData.companyName,
  });

  tenant.adminUserId = adminUser.id;
  tenants = [tenant, ...tenants];

  return tenant;
}

/**
 * Simulates PUT /api/v1/tenants/{id} — edits basic factory info.
 * @param {string} id
 * @param {Partial<Tenant>} updates
 */
export async function updateTenant(id, updates) {
  await wait(DELAY_MS);
  tenants = tenants.map((t) => (t.id === id ? { ...t, ...updates } : t));
  return tenants.find((t) => t.id === id);
}

/**
 * Simulates PATCH /api/v1/tenants/{id}/status — Super Admin
 * activates or suspends (freezes) a factory account.
 * @param {string} id
 * @param {'Active'|'Suspended'} status
 */
export async function updateTenantStatus(id, status) {
  await wait(300);
  tenants = tenants.map((t) => (t.id === id ? { ...t, status } : t));
  return tenants.find((t) => t.id === id);
}

/**
 * Simulates DELETE /api/v1/tenants/{id}
 * @param {string} id
 */
export async function deleteTenant(id) {
  await wait(DELAY_MS);
  tenants = tenants.filter((t) => t.id !== id);
  return { id };
}