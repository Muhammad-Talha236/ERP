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

  // --- Retroactive default bundles for orders that had none before ---
{ id: 'bun-2401-1', orderId: 'po-2401', bundleNumber: 'B-2401-1', quantity: 250, currentStageOrder: 1, currentStageName: 'Material Allocation', assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
{ id: 'bun-2405-1', orderId: 'po-2405', bundleNumber: 'B-2405-1', quantity: 60, currentStageOrder: 6, currentStageName: 'Packaging', assignedEmployeeId: null, assignedEmployeeName: null, status: 'Completed' },
{ id: 'bun-2406-1', orderId: 'po-2406', bundleNumber: 'B-2406-1', quantity: 500, currentStageOrder: 1, currentStageName: 'Material Allocation', assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
{ id: 'bun-2407-1', orderId: 'po-2407', bundleNumber: 'B-2407-1', quantity: 180, currentStageOrder: 1, currentStageName: 'Material Allocation', assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
{ id: 'bun-2408-1', orderId: 'po-2408', bundleNumber: 'B-2408-1', quantity: 400, currentStageOrder: 6, currentStageName: 'Packaging', assignedEmployeeId: null, assignedEmployeeName: null, status: 'Completed' },
];