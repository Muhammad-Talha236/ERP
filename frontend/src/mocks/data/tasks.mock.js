/**
 * tasks.mock.js — generic tasks for the Kanban Board (distinct from
 * Production's order-tracking Kanban — this one is for general
 * shop-floor tasks like maintenance, audits, restocking).
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} taskNumber      - e.g. "T-1"
 * @property {string} title
 * @property {string} assigneeId
 * @property {string} assigneeName
 * @property {'To Do'|'In Progress'|'Review'|'Done'} status
 * @property {'Low'|'Medium'|'High'} priority
 * @property {string} dueDate
 * @property {number} commentCount
 */

export const tasksMockData = [
  { id: 'task-001', taskNumber: 'T-1', title: 'Calibrate CNC-04 spindle', assigneeId: 'emp-005', assigneeName: 'Sofia Ivanova', status: 'To Do', priority: 'High', dueDate: '2026-07-18', commentCount: 2 },
  { id: 'task-002', taskNumber: 'T-2', title: 'Restock PP granules', assigneeId: 'emp-003', assigneeName: 'Aisha Rahman', status: 'To Do', priority: 'Medium', dueDate: '2026-07-19', commentCount: 2 },
  { id: 'task-003', taskNumber: 'T-3', title: 'Weekly safety audit', assigneeId: 'emp-002', assigneeName: 'Marcus Chen', status: 'In Progress', priority: 'High', dueDate: '2026-07-20', commentCount: 2 },
  { id: 'task-004', taskNumber: 'T-4', title: 'Refit assembly jig B7', assigneeId: 'emp-006', assigneeName: 'Kenji Watanabe', status: 'In Progress', priority: 'Medium', dueDate: '2026-07-21', commentCount: 2 },
  { id: 'task-005', taskNumber: 'T-5', title: 'QC report — Rubber Seal Kit', assigneeId: 'emp-002', assigneeName: 'Marcus Chen', status: 'Review', priority: 'Medium', dueDate: '2026-07-18', commentCount: 2 },
  { id: 'task-006', taskNumber: 'T-6', title: 'Ship Copper Coil C4', assigneeId: 'emp-004', assigneeName: 'Diego Alvarez', status: 'Done', priority: 'Low', dueDate: '2026-07-15', commentCount: 2 },
  { id: 'task-007', taskNumber: 'T-7', title: 'Approve July purchase batch', assigneeId: 'emp-001', assigneeName: 'Priya Menon', status: 'Done', priority: 'High', dueDate: '2026-07-14', commentCount: 2 },
];