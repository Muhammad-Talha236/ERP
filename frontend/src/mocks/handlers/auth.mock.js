import { usersMockData } from '@/mocks/data/users.mock';

const DELAY_MS = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let users = [...usersMockData];

/**
 * Simulates POST /api/v1/auth/login
 */
export async function login({ email, password }) {
  await wait(DELAY_MS);

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password.');
  }

  const { password: _password, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken: `mock-token-${user.id}-${Date.now()}`,
  };
}

/**
 * INTERNAL — used by tenant.mock.js when Super Admin creates a new
 * factory + admin. Not exposed as a public "signup" endpoint; only
 * ever called from the Super Admin's Create Factory flow.
 * @param {{ firstName, lastName, email, password, tenantId, tenantName }} adminData
 * @returns {User}
 */
export function _createAdminUser(adminData) {
  const newUser = {
    id: `user-${Date.now()}`,
    role: 'Admin',
    ...adminData,
  };
  users = [...users, newUser];
  return newUser;
}

/**
 * Exposed so tenant.mock.js can check for duplicate emails when
 * Super Admin creates a new admin account.
 */
export function _emailExists(email) {
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}