/**
 * leaveRequests.mock.js — fake leave request data for the
 * "Leave Requests" table on the Attendance page.
 *
 * @typedef {Object} LeaveRequest
 * @property {string} id
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {string} type          - e.g. "Sick leave", "Personal", "Vacation"
 * @property {string} fromDate      - ISO date string
 * @property {string} toDate        - ISO date string
 * @property {'Pending'|'Paid'|'Processing'|'Rejected'} status
 */

export const leaveRequestsMockData = [
  {
    id: 'lr-001',
    employeeId: 'emp-003',
    employeeName: 'Aisha Rahman',
    type: 'Sick leave',
    fromDate: '2026-07-14',
    toDate: '2026-07-16',
    status: 'Pending',
  },
  {
    id: 'lr-002',
    employeeId: 'emp-004',
    employeeName: 'Diego Alvarez',
    type: 'Personal',
    fromDate: '2026-07-18',
    toDate: '2026-07-18',
    status: 'Paid',
  },
  {
    id: 'lr-003',
    employeeId: 'emp-005',
    employeeName: 'Sofia Ivanova',
    type: 'Vacation',
    fromDate: '2026-08-01',
    toDate: '2026-08-07',
    status: 'Processing',
  },
];