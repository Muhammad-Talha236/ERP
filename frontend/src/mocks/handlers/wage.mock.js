import { wagesMockData } from '@/mocks/data/wages.mock';
import { paymentHistoryMockData } from '@/mocks/data/paymentHistory.mock';

const DELAY_MS = 400;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let wages = [...wagesMockData];
let paymentHistory = [...paymentHistoryMockData];

function deriveStatus(amountPaid, netAmount) {
  if (amountPaid <= 0) return 'Pending';
  if (amountPaid >= netAmount) return 'Paid';
  return 'Partial';
}

export async function fetchWages(params = {}) {
  await wait(DELAY_MS);
  let result = [...wages];
  if (params.employeeId) result = result.filter((w) => w.employeeId === params.employeeId);
  if (params.status && params.status !== 'all') result = result.filter((w) => w.paymentStatus === params.status);
  return result;
}

export async function fetchPaymentHistory(wageId) {
  await wait(250);
  return paymentHistory
    .filter((p) => p.wageId === wageId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Simulates POST /api/v1/wages/{wageId}/payments — records a NEW
 * payment or advance. See previous version's comments for full
 * rationale (amount is ADDED to amountPaid, status is derived,
 * a transaction is logged).
 */
export async function recordWagePayment(wageId, paymentData) {
  await wait(DELAY_MS);

  const wage = wages.find((w) => w.id === wageId);
  if (!wage) throw new Error('Wage record not found.');

  const remaining = wage.netAmount - wage.amountPaid;
  if (paymentData.amount > remaining) {
    throw new Error(`Payment amount cannot exceed the remaining balance of $${remaining}.`);
  }

  const newAmountPaid = wage.amountPaid + paymentData.amount;
  const today = new Date().toISOString().slice(0, 10);

  wages = wages.map((w) =>
    w.id === wageId
      ? { ...w, amountPaid: newAmountPaid, paymentStatus: deriveStatus(newAmountPaid, w.netAmount), paymentDate: today }
      : w
  );

  const transaction = {
    id: `pay-${Date.now()}`,
    wageId,
    employeeId: wage.employeeId,
    employeeName: wage.employeeName,
    type: paymentData.type,
    amount: paymentData.amount,
    date: today,
    remarks: paymentData.remarks || null,
  };

  paymentHistory = [transaction, ...paymentHistory];

  return { wage: wages.find((w) => w.id === wageId), transaction };
}

/**
 * Simulates PUT /api/v1/payments/{transactionId} — edits an
 * EXISTING payment/advance transaction (correcting a wrong amount
 * or remark after the fact).
 *
 * IMPORTANT: editing a transaction's amount must keep the parent
 * wage record's amountPaid mathematically consistent. We do this by
 * computing the DIFFERENCE between the old and new amount, then
 * applying just that difference to amountPaid — rather than
 * re-summing everything from scratch, which keeps the logic simple
 * and correct even with many transactions.
 *
 * @param {string} transactionId
 * @param {{ amount: number, remarks?: string, type?: 'Payment'|'Advance' }} updates
 * @returns {Promise<{ wage: WageRecord, transaction: PaymentTransaction }>}
 */
export async function updatePaymentTransaction(transactionId, updates) {
  await wait(DELAY_MS);

  const transaction = paymentHistory.find((p) => p.id === transactionId);
  if (!transaction) throw new Error('Payment record not found.');

  const wage = wages.find((w) => w.id === transaction.wageId);
  if (!wage) throw new Error('Wage record not found.');

  const amountDifference = updates.amount - transaction.amount;
  const newAmountPaid = wage.amountPaid + amountDifference;

  // Guard rails: the corrected total can't go negative or exceed
  // the period's net payable amount.
  if (newAmountPaid < 0) {
    throw new Error('This edit would make the total paid amount negative.');
  }
  if (newAmountPaid > wage.netAmount) {
    throw new Error(`This edit would exceed the net payable amount of $${wage.netAmount}.`);
  }

  paymentHistory = paymentHistory.map((p) =>
    p.id === transactionId
      ? { ...p, amount: updates.amount, remarks: updates.remarks ?? p.remarks, type: updates.type ?? p.type }
      : p
  );

  wages = wages.map((w) =>
    w.id === wage.id
      ? { ...w, amountPaid: newAmountPaid, paymentStatus: deriveStatus(newAmountPaid, w.netAmount) }
      : w
  );

  return {
    wage: wages.find((w) => w.id === wage.id),
    transaction: paymentHistory.find((p) => p.id === transactionId),
  };
}

/**
 * creditProductionWage — increases an employee's current wage
 * record when they complete a production stage assignment. This is
 * what makes "wage per person" real: finishing work adds actual
 * money to the employee's payable wage.
 *
 * @param {string} employeeId
 * @param {number} amount
 * @returns {WageRecord|null}
 */
export function creditProductionWage(employeeId, amount) {
  const record = wages.find((w) => w.employeeId === employeeId);
  if (!record) return null;

  wages = wages.map((w) =>
    w.employeeId === employeeId
      ? { ...w, grossAmount: w.grossAmount + amount, netAmount: w.netAmount + amount }
      : w
  );

  return wages.find((w) => w.employeeId === employeeId);
}