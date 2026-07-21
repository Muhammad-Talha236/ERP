/**
 * productionBundles.mock.js — a production order split into smaller
 * batches (bundles), each assigned to an employee at a specific
 * workflow stage. Matches PO Flow Step 5's "bundle receipt" concept
 * — a bundle IS the unit that gets received/moved/logged at each stage.
 *
 * @typedef {Object} ProductionBundle
 * @property {string} id
 * @property {string} orderId
 * @property {string} bundleNumber
 * @property {number} quantity
 * @property {number} currentStageOrder
 * @property {string} currentStageName
 * @property {string|null} assignedEmployeeId
 * @property {string|null} assignedEmployeeName
 * @property {'Not Started'|'In Progress'|'Completed'} status
 */

export const productionBundlesMockData = [
  { id: 'bun-001', orderId: 'po-2402', bundleNumber: 'B-2402-1', quantity: 200, currentStageOrder: 3, currentStageName: 'Stitching', assignedEmployeeId: 'emp-001', assignedEmployeeName: 'Priya Menon', status: 'In Progress' },
  { id: 'bun-002', orderId: 'po-2402', bundleNumber: 'B-2402-2', quantity: 200, currentStageOrder: 3, currentStageName: 'Stitching', assignedEmployeeId: 'emp-006', assignedEmployeeName: 'Kenji Watanabe', status: 'In Progress' },
  { id: 'bun-003', orderId: 'po-2402', bundleNumber: 'B-2402-3', quantity: 200, currentStageOrder: 2, currentStageName: 'Cutting', assignedEmployeeId: 'emp-004', assignedEmployeeName: 'Diego Alvarez', status: 'Completed' },
  { id: 'bun-004', orderId: 'po-2402', bundleNumber: 'B-2402-4', quantity: 200, currentStageOrder: 1, currentStageName: 'Material Allocation', assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },

  { id: 'bun-005', orderId: 'po-2403', bundleNumber: 'B-2403-1', quantity: 60, currentStageOrder: 2, currentStageName: 'Cutting', assignedEmployeeId: 'emp-008', assignedEmployeeName: 'Omar Farooq', status: 'In Progress' },
  { id: 'bun-006', orderId: 'po-2403', bundleNumber: 'B-2403-2', quantity: 60, currentStageOrder: 1, currentStageName: 'Material Allocation', assignedEmployeeId: 'emp-005', assignedEmployeeName: 'Sofia Ivanova', status: 'Completed' },

  { id: 'bun-007', orderId: 'po-2404', bundleNumber: 'B-2404-1', quantity: 1500, currentStageOrder: 5, currentStageName: 'Quality Check', assignedEmployeeId: 'emp-002', assignedEmployeeName: 'Marcus Chen', status: 'In Progress' },
  { id: 'bun-008', orderId: 'po-2404', bundleNumber: 'B-2404-2', quantity: 1500, currentStageOrder: 5, currentStageName: 'Quality Check', assignedEmployeeId: 'emp-002', assignedEmployeeName: 'Marcus Chen', status: 'In Progress' },
];