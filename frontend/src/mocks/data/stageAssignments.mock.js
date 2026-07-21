/**
 * stageAssignments.mock.js — INDIVIDUAL employee assignments within
 * one order's workflow step. A single step (e.g. Stitching, headcount
 * 8) can have MULTIPLE employees each working their own portion —
 * the step is only "Completed" once every assignment under it is
 * marked done.
 *
 * @typedef {Object} StageAssignment
 * @property {string} id
 * @property {string} stepId          - FK to OrderWorkflowStep.id
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {boolean} isDone
 * @property {string|null} completedAt
 */

export const stageAssignmentsMockData = [
  // PO-2402's Stitching step (ows-003) — 2 of the 8 headcount seeded as an example
  { id: 'sa-001', stepId: 'ows-003', employeeId: 'emp-001', employeeName: 'Priya Menon', isDone: false, completedAt: null },
  { id: 'sa-002', stepId: 'ows-003', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', isDone: false, completedAt: null },

  // PO-2402's Cutting step (ows-002) — already fully done, matches step.status = 'Completed'
  { id: 'sa-003', stepId: 'ows-002', employeeId: 'emp-004', employeeName: 'Diego Alvarez', isDone: true, completedAt: '2026-07-15' },

  // PO-2403's Cutting step (ows-008) — one employee, still working
  { id: 'sa-004', stepId: 'ows-008', employeeId: 'emp-008', employeeName: 'Omar Farooq', isDone: false, completedAt: null },
];