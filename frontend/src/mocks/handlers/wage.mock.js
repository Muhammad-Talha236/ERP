import { wagesMockData } from '@/mocks/data/wages.mock';

const DELAY_MS = 400;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let wages = [...wagesMockData];

/**
 * Simulates GET /api/v1/wages
 * @param {{ employeeId?: string, status?: string }} params
 * @returns {Promise<WageRecord[]>}
 */
export async function fetchWages(params = {}) {
  await wait(DELAY_MS);

  let result = [...wages];

  if (params.employeeId) {
    result = result.filter((w) => w.employeeId === params.employeeId);
  }

  if (params.status && params.status !== 'all') {
    result = result.filter((w) => w.paymentStatus === params.status);
  }

  return result;
}

/**
 * Simulates PATCH /api/v1/wages/{id}/pay — marks ONE specific wage
 * record as Paid. This is the admin's per-employee "pay this person"
 * action, matching real payroll behavior: paying one employee should
 * never silently change another employee's payment status.
 *
 * @param {string} id - wage record id
 * @returns {Promise<WageRecord>}
 */
export async function markWageAsPaid(id) {
  await wait(DELAY_MS);

  wages = wages.map((w) =>
    w.id === id
      ? { ...w, paymentStatus: 'Paid', paymentDate: new Date().toISOString().slice(0, 10) }
      : w
  );

  return wages.find((w) => w.id === id);
}

/**
 * Simulates POST /api/v1/payroll/generate — bulk-processes every
 * Pending/Processing record into Paid. Kept available (some real
 * payroll systems DO support "pay everyone now"), but the UI will
 * now default to per-employee control via markWageAsPaid instead,
 * and only offer this as an explicit, clearly-labeled bulk action.
 *
 * @returns {Promise<WageRecord[]>}
 */
export async function processPendingPayroll() {
  await wait(600);

  wages = wages.map((w) =>
    w.paymentStatus === 'Pending' || w.paymentStatus === 'Processing'
      ? { ...w, paymentStatus: 'Paid', paymentDate: new Date().toISOString().slice(0, 10) }
      : w
  );

  return wages;
}