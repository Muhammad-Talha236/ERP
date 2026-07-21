/**
 * bundleStageMovements.mock.js — the append-only log of every
 * bundle's movement through each stage. THIS is what PO Flow Step 5
 * means by "employees log bundle receipt and output at each stage" —
 * each row is one such log entry.
 *
 * @typedef {Object} BundleStageMovement
 * @property {string} id
 * @property {string} bundleId
 * @property {string} orderId          - denormalized for easy querying by order
 * @property {string} stageName
 * @property {number} stageOrder
 * @property {string} loggedByEmployeeId
 * @property {string} loggedByEmployeeName
 * @property {number} quantityReceived
 * @property {number} quantityOutput   - how many successfully completed this stage
 * @property {number} quantityWastage  - defects/losses at this stage
 * @property {string} date
 * @property {string|null} remarks
 */

export const bundleStageMovementsMockData = [
  // Bundle B-2402-3 completed Cutting
  { id: 'mov-001', bundleId: 'bun-003', orderId: 'po-2402', stageName: 'Cutting', stageOrder: 2, loggedByEmployeeId: 'emp-004', loggedByEmployeeName: 'Diego Alvarez', quantityReceived: 200, quantityOutput: 198, quantityWastage: 2, date: '2026-07-15', remarks: 'Minor fabric defects on 2 pieces' },

  // Bundle B-2402-1 and B-2402-2 currently in Stitching (received, not yet output)
  { id: 'mov-002', bundleId: 'bun-001', orderId: 'po-2402', stageName: 'Stitching', stageOrder: 3, loggedByEmployeeId: 'emp-001', loggedByEmployeeName: 'Priya Menon', quantityReceived: 200, quantityOutput: 0, quantityWastage: 0, date: '2026-07-16', remarks: 'Received, work in progress' },
  { id: 'mov-003', bundleId: 'bun-002', orderId: 'po-2402', stageName: 'Stitching', stageOrder: 3, loggedByEmployeeId: 'emp-006', loggedByEmployeeName: 'Kenji Watanabe', quantityReceived: 200, quantityOutput: 0, quantityWastage: 0, date: '2026-07-16', remarks: 'Received, work in progress' },

  // Bundle B-2403-2 completed Material Allocation
  { id: 'mov-004', bundleId: 'bun-006', orderId: 'po-2403', stageName: 'Material Allocation', stageOrder: 1, loggedByEmployeeId: 'emp-005', loggedByEmployeeName: 'Sofia Ivanova', quantityReceived: 60, quantityOutput: 60, quantityWastage: 0, date: '2026-07-16', remarks: null },

  // Bundle B-2403-1 currently in Cutting
  { id: 'mov-005', bundleId: 'bun-005', orderId: 'po-2403', stageName: 'Cutting', stageOrder: 2, loggedByEmployeeId: 'emp-008', loggedByEmployeeName: 'Omar Farooq', quantityReceived: 60, quantityOutput: 0, quantityWastage: 0, date: '2026-07-17', remarks: 'Received today' },

  // Bundles B-2404-1/2 in Quality Check
  { id: 'mov-006', bundleId: 'bun-007', orderId: 'po-2404', stageName: 'Quality Check', stageOrder: 5, loggedByEmployeeId: 'emp-002', loggedByEmployeeName: 'Marcus Chen', quantityReceived: 1500, quantityOutput: 1480, quantityWastage: 20, date: '2026-07-17', remarks: '20 units failed seal integrity check' },
  { id: 'mov-007', bundleId: 'bun-008', orderId: 'po-2404', stageName: 'Quality Check', stageOrder: 5, loggedByEmployeeId: 'emp-002', loggedByEmployeeName: 'Marcus Chen', quantityReceived: 1500, quantityOutput: 0, quantityWastage: 0, date: '2026-07-17', remarks: 'Received, inspection in progress' },
];