import { tenantsMockData } from '@/mocks/data/tenants.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let tenants = [...tenantsMockData];

/**
 * Simulates GET /api/v1/tenants
 * @returns {Promise<Tenant[]>}
 */
export async function fetchTenants() {
  await wait(DELAY_MS);
  return [...tenants];
}

/**
 * Simulates PATCH /api/v1/tenants/{id}/status — Super Admin
 * activates/suspends a factory account.
 * @param {string} id
 * @param {'Active'|'Suspended'} status
 * @returns {Promise<Tenant>}
 */
export async function updateTenantStatus(id, status) {
  await wait(300);
  tenants = tenants.map((t) => (t.id === id ? { ...t, status } : t));
  return tenants.find((t) => t.id === id);
}