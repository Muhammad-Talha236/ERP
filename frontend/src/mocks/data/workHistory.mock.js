/**
 * workHistory.mock.js — fake employment history entries.
 *
 * @typedef {Object} WorkHistoryEntry
 * @property {string} id
 * @property {string} employeeId    - FK to Employee.id
 * @property {string} date          - ISO date string
 * @property {'Hired'|'Promotion'|'Transfer'|'Salary Change'|'Status Change'} type
 * @property {string} description
 */

export const workHistoryMockData = [
  {
    id: 'wh-001',
    employeeId: 'emp-001',
    date: '2021-03-14',
    type: 'Hired',
    description: 'Joined as Assembly Operator in the Assembly department.',
  },
  {
    id: 'wh-002',
    employeeId: 'emp-001',
    date: '2022-06-01',
    type: 'Promotion',
    description: 'Promoted from Assembly Operator to Line Supervisor.',
  },
  {
    id: 'wh-003',
    employeeId: 'emp-001',
    date: '2023-01-10',
    type: 'Salary Change',
    description: 'Base salary increased from $54,000 to $62,000 annually.',
  },
  {
    id: 'wh-004',
    employeeId: 'emp-002',
    date: '2020-08-02',
    type: 'Hired',
    description: 'Joined as QA Engineer in the Quality department.',
  },
  {
    id: 'wh-005',
    employeeId: 'emp-002',
    date: '2024-02-15',
    type: 'Salary Change',
    description: 'Annual raise applied: $65,000 to $71,000.',
  },
  {
    id: 'wh-006',
    employeeId: 'emp-003',
    date: '2019-11-19',
    type: 'Hired',
    description: 'Joined as Packaging Assistant.',
  },
  {
    id: 'wh-007',
    employeeId: 'emp-003',
    date: '2021-04-05',
    type: 'Promotion',
    description: 'Promoted to Team Lead, Packaging department.',
  },
  {
    id: 'wh-008',
    employeeId: 'emp-003',
    date: '2026-07-14',
    type: 'Status Change',
    description: 'Status changed to On Leave (Sick leave, approved).',
  },
];