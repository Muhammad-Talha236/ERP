import { usersMockData } from '@/mocks/data/users.mock';

const DELAY_MS = 500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let users = [...usersMockData];

/**
 * Simulates POST /api/v1/auth/login
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: Omit<User, 'password'>, accessToken: string }>}
 */
export async function login({ email, password }) {
  await wait(DELAY_MS);

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password.');
  }

  // Never return the password field, even in mock data — mirrors
  // the real API's documented behavior of never exposing password hashes.
  const { password: _password, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken: `mock-token-${user.id}-${Date.now()}`,
  };
}

/**
 * Simulates POST /api/v1/auth/signup
 *
 * New signups are ALWAYS created as 'Admin' role (Factory Admin) —
 * SuperAdmin accounts are provisioned separately by the platform,
 * never through public signup, matching real-world SaaS practice.
 *
 * @param {{ firstName, lastName, email, password, companyName }} formData
 * @returns {Promise<{ user: Omit<User, 'password'>, accessToken: string }>}
 */
export async function signup(formData) {
  await wait(DELAY_MS);

  const existing = users.find((u) => u.email.toLowerCase() === formData.email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    role: 'Admin',
    tenantId: `tenant-${Date.now()}`,
    tenantName: formData.companyName,
  };

  users = [...users, newUser];

  const { password: _password, ...safeUser } = newUser;

  return {
    user: safeUser,
    accessToken: `mock-token-${newUser.id}-${Date.now()}`,
  };
}