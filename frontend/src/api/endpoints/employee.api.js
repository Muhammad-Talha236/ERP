import { apiClient } from '@/api/client';

/**
 * employee.api.js — REAL API calls for the Employees module,
 * matching endpoints documented in docs/API/05_API_Documentation_Part3.md
 *
 * Every function here has the EXACT SAME name and parameter shape
 * as its counterpart in mocks/handlers/employee.mock.js. This is
 * intentional: a hook like useEmployees.js only needs to change
 * ONE import line to switch from mock to real data — the rest of
 * the hook (and every component using it) stays identical.
 */

/** GET /api/v1/employees */
export async function fetchEmployees(params = {}) {
  return apiClient.get('/employees', { params });
}

/** GET /api/v1/employees/{id} */
export async function fetchEmployeeById(id) {
  return apiClient.get(`/employees/${id}`);
}

/** POST /api/v1/employees */
export async function createEmployee(newEmployee) {
  return apiClient.post('/employees', newEmployee);
}

/** PUT /api/v1/employees/{id} */
export async function updateEmployee(id, updates) {
  return apiClient.put(`/employees/${id}`, updates);
}

/** DELETE /api/v1/employees/{id} */
export async function deleteEmployee(id) {
  return apiClient.delete(`/employees/${id}`);
}