/**
 * wages.mock.js — fake payroll/wage records for July 2026.
 *
 * @typedef {Object} WageRecord
 * @property {string} id
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {string} department
 * @property {string} payPeriodStart
 * @property {string} payPeriodEnd
 * @property {'Daily'|'Monthly'|'Piece Rate'} salaryType
 * @property {number} grossAmount
 * @property {number} overtimeAmount
 * @property {number} deductions
 * @property {number} netAmount        - TOTAL payable for this period
 * @property {number} amountPaid       - cumulative amount paid so far (partial or full, including advances given this period)
 * @property {'Pending'|'Partial'|'Paid'} paymentStatus - DERIVED from amountPaid vs netAmount, kept in sync by the mock handler on every payment
 * @property {string|null} paymentDate - date of the MOST RECENT payment, or null if nothing paid yet
 */

export const wagesMockData = [
  {
    id: 'wage-001',
    employeeId: 'emp-001',
    employeeName: 'Priya Menon',
    department: 'Assembly',
    payPeriodStart: '2026-07-01',
    payPeriodEnd: '2026-07-31',
    salaryType: 'Monthly',
    grossAmount: 5166,
    overtimeAmount: 320,
    deductions: 480,
    netAmount: 5006,
    amountPaid: 5006, // fully paid
    paymentStatus: 'Paid',
    paymentDate: '2026-07-31',
  },
  {
    id: 'wage-002',
    employeeId: 'emp-002',
    employeeName: 'Marcus Chen',
    department: 'Quality',
    payPeriodStart: '2026-07-01',
    payPeriodEnd: '2026-07-31',
    salaryType: 'Monthly',
    grossAmount: 5916,
    overtimeAmount: 210,
    deductions: 540,
    netAmount: 5586,
    amountPaid: 5586,
    paymentStatus: 'Paid',
    paymentDate: '2026-07-31',
  },
  {
    id: 'wage-003',
    employeeId: 'emp-003',
    employeeName: 'Aisha Rahman',
    department: 'Packaging',
    payPeriodStart: '2026-07-01',
    payPeriodEnd: '2026-07-31',
    salaryType: 'Monthly',
    grossAmount: 4833,
    overtimeAmount: 0,
    deductions: 420,
    netAmount: 4413,
    amountPaid: 0, // nothing paid yet
    paymentStatus: 'Pending',
    paymentDate: null,
  },
  {
    id: 'wage-004',
    employeeId: 'emp-004',
    employeeName: 'Diego Alvarez',
    department: 'Logistics',
    payPeriodStart: '2026-07-01',
    payPeriodEnd: '2026-07-31',
    salaryType: 'Monthly',
    grossAmount: 3833,
    overtimeAmount: 280,
    deductions: 320,
    netAmount: 3793,
    amountPaid: 1500, // PARTIAL example — 1500 paid, 2293 still pending
    paymentStatus: 'Partial',
    paymentDate: '2026-07-20',
  },
  {
    id: 'wage-005',
    employeeId: 'emp-005',
    employeeName: 'Sofia Ivanova',
    department: 'Maintenance',
    payPeriodStart: '2026-07-01',
    payPeriodEnd: '2026-07-31',
    salaryType: 'Monthly',
    grossAmount: 4500,
    overtimeAmount: 190,
    deductions: 380,
    netAmount: 4310,
    amountPaid: 4310,
    paymentStatus: 'Paid',
    paymentDate: '2026-07-31',
  },
  {
    id: 'wage-006',
    employeeId: 'emp-006',
    employeeName: 'Kenji Watanabe',
    department: 'Assembly',
    payPeriodStart: '2026-07-01',
    payPeriodEnd: '2026-07-31',
    salaryType: 'Daily',
    grossAmount: 3500,
    overtimeAmount: 410,
    deductions: 290,
    netAmount: 3620,
    amountPaid: 500, // PARTIAL example — small advance-like payment given
    paymentStatus: 'Partial',
    paymentDate: '2026-07-05',
  },
];