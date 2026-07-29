/**
 * bundleStageAssignments.mock.js — PER-BUNDLE employee assignments.
 * Each bundle now moves through the order's stages INDEPENDENTLY —
 * this table tracks which employees worked which stage for which
 * specific bundle, separate from any other bundle in the same order.
 *
 * @typedef {Object} BundleStageAssignment
 * @property {string} id
 * @property {string} bundleId
 * @property {string} stepId       - FK to the order's OrderWorkflowStep
 * @property {number} stageOrder
 * @property {string} stageName
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {boolean} isDone
 * @property {string|null} completedAt
 */
export const bundleStageAssignmentsMockData = [];