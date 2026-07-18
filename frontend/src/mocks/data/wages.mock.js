/**
 * wages.mock.js — fake payroll/wage records for July 2026.
 *
 * @typedef {Object} WageRecord
 * @property {string} id
 * @property {string} employeeId
 * @property {string} employeeName    - denormalized for display
 * @property {string} department      - denormalized for display
 * @property {string} payPeriodStart  - ISO date string
 * @property {string} payPeriodEnd    - ISO date string
 * @property {'Daily'|'Monthly'|'Piece Rate'} salaryType
 * @property {number} grossAmount
 * @property {number} overtimeAmount
 * @property {number} deductions
 * @property {number} advances
 * @property {number} netAmount
 * @property {'Pending'|'Partial'|'Paid'|'Processing'} paymentStatus
 * @property {string|null} paymentDate
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
    advances: 0,
    netAmount: 5006,
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
    advances: 0,
    netAmount: 5586,
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
    advances: 0,
    netAmount: 4413,
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
    advances: 0,
    netAmount: 3793,
    paymentStatus: 'Processing',
    paymentDate: null,
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
    advances: 0,
    netAmount: 4310,
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
    advances: 0,
    netAmount: 3620,
    paymentStatus: 'Pending',
    paymentDate: null,
  },
];