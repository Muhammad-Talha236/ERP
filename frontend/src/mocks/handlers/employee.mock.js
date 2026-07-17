import { employeesMockData } from '@/mocks/data/employees.mock';

/**
 * employee.mock.js — simulated API layer for the Employees module.
 *
 * Every function here mirrors the shape/behavior of what
 * src/api/endpoints/employee.api.js will eventually do for real:
 *  - returns a Promise
 *  - has an artificial delay (simulates network latency, so loading
 *    states/skeletons can be tested honestly during development)
 *  - throws on "not found" the same way an axios 404 would
 *
 * We keep a mutable in-memory copy (not the original import) so
 * create/update/delete actions during a dev session actually persist
 * until the page is refreshed — closer to real API behavior than if
 * mutations were no-ops.
 */

let employees = [...employeesMockData];

const DELAY_MS = 400;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates GET /api/v1/employees
 * Supports optional search/filter params, matching the real API's
 * documented query params (?search=, ?department=, ?status=).
 *
 * @param {{ search?: string, department?: string, status?: string }} params
 * @returns {Promise<Employee[]>}
 */
export async function fetchEmployees(params = {}) {
  await wait(DELAY_MS);

  let result = [...employees];

  if (params.search) {
    const query = params.search.toLowerCase();
    result = result.filter(
      (emp) =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(query) ||
        emp.employeeCode.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)
    );
  }

  if (params.department && params.department !== 'all') {
    result = result.filter((emp) => emp.department === params.department);
  }

  if (params.status && params.status !== 'all') {
    result = result.filter((emp) => emp.status === params.status);
  }

  return result;
}

/**
 * Simulates GET /api/v1/employees/{id}
 * @param {string} id
 * @returns {Promise<Employee>}
 */
export async function fetchEmployeeById(id) {
  await wait(DELAY_MS);

  const employee = employees.find((emp) => emp.id === id);
  if (!employee) {
    throw new Error('Employee not found.');
  }
  return employee;
}

/**
 * Simulates POST /api/v1/employees
 * @param {Omit<Employee, 'id'>} newEmployee
 * @returns {Promise<Employee>}
 */
export async function createEmployee(newEmployee) {
  await wait(DELAY_MS);

  const employee = {
    id: `emp-${Date.now()}`, // temporary client-side id, mimics UUID for now
    ...newEmployee,
  };

  employees = [employee, ...employees];
  return employee;
}

/**
 * Simulates PUT /api/v1/employees/{id}
 * @param {string} id
 * @param {Partial<Employee>} updates
 * @returns {Promise<Employee>}
 */
export async function updateEmployee(id, updates) {
  await wait(DELAY_MS);

  employees = employees.map((emp) =>
    emp.id === id ? { ...emp, ...updates } : emp
  );

  return employees.find((emp) => emp.id === id);
}

/**
 * Simulates DELETE /api/v1/employees/{id} (soft delete per business rules)
 * @param {string} id
 * @returns {Promise<{ id: string }>}
 */
export async function deleteEmployee(id) {
  await wait(DELAY_MS);

  employees = employees.filter((emp) => emp.id !== id);
  return { id };
}