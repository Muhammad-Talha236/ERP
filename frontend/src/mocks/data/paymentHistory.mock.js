/**
 * paymentHistory.mock.js — a log of every payment/advance ever made
 * against a wage record. This is what powers the "payment history"
 * view — separate from wages.mock.js, which only holds the CURRENT
 * cumulative totals.
 *
 * @typedef {Object} PaymentTransaction
 * @property {string} id
 * @property {string} wageId          - FK to WageRecord.id
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {'Payment'|'Advance'} type
 * @property {number} amount
 * @property {string} date            - ISO date string
 * @property {string|null} remarks
 */

export const paymentHistoryMockData = [
  { id: 'pay-001', wageId: 'wage-001', employeeId: 'emp-001', employeeName: 'Priya Menon', type: 'Payment', amount: 5006, date: '2026-07-31', remarks: 'Full monthly payment' },
  { id: 'pay-002', wageId: 'wage-002', employeeId: 'emp-002', employeeName: 'Marcus Chen', type: 'Payment', amount: 5586, date: '2026-07-31', remarks: 'Full monthly payment' },
  { id: 'pay-003', wageId: 'wage-004', employeeId: 'emp-004', employeeName: 'Diego Alvarez', type: 'Advance', amount: 1500, date: '2026-07-20', remarks: 'Requested advance for personal expense' },
  { id: 'pay-004', wageId: 'wage-005', employeeId: 'emp-005', employeeName: 'Sofia Ivanova', type: 'Payment', amount: 4310, date: '2026-07-31', remarks: 'Full monthly payment' },
  { id: 'pay-005', wageId: 'wage-006', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', type: 'Advance', amount: 500, date: '2026-07-05', remarks: 'Advance against daily wages' },
];