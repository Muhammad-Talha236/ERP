/**
 * orderWorkflowSteps.mock.js — PER-ORDER workflow steps.
 *
 * THIS IS THE KEY TABLE for PO Flow Step 3-4:
 *  - Step 3: "Production workflow steps are attached to the PO" —
 *    these rows ARE that attachment. When a PO is created, the
 *    chosen WorkflowTemplate's stages are copied here as a snapshot.
 *  - Step 4: "Per step: prices, expenses, and assigned employees
 *    with wages can be modified" — because these are the PO's OWN
 *    copies (not references back to the template), editing one
 *    PO's "Stitching" wage never affects any other PO using the
 *    same template.
 *
 * @typedef {Object} OrderWorkflowStep
 * @property {string} id
 * @property {string} orderId          - FK to ProductionOrder.id
 * @property {string} stageName
 * @property {number} stageOrder
 * @property {number} expense          - editable per-PO
 * @property {number} wagePerUnit      - editable per-PO
 * @property {number} headcount        - editable per-PO
 * @property {string|null} assignedEmployeeId   - the stage's lead/primary assignee (individual bundles can still have their own assignee — see productionBundles.mock.js)
 * @property {string|null} assignedEmployeeName
 * @property {'Not Started'|'In Progress'|'Completed'} status
 */

export const orderWorkflowStepsMockData = [
  // --- PO-2402 (Steel Bracket B7) — using wft-polo template, currently at stage 3 ---
  { id: 'ows-001', orderId: 'po-2402', stageName: 'Material Allocation', stageOrder: 1, expense: 200, wagePerUnit: 2, headcount: 2, assignedEmployeeId: 'emp-005', assignedEmployeeName: 'Sofia Ivanova', status: 'Completed' },
  { id: 'ows-002', orderId: 'po-2402', stageName: 'Cutting', stageOrder: 2, expense: 500, wagePerUnit: 5, headcount: 3, assignedEmployeeId: 'emp-004', assignedEmployeeName: 'Diego Alvarez', status: 'Completed' },
  { id: 'ows-003', orderId: 'po-2402', stageName: 'Stitching', stageOrder: 3, expense: 1200, wagePerUnit: 15, headcount: 8, assignedEmployeeId: 'emp-001', assignedEmployeeName: 'Priya Menon', status: 'In Progress' },
  { id: 'ows-004', orderId: 'po-2402', stageName: 'Printing', stageOrder: 4, expense: 350, wagePerUnit: 6, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-005', orderId: 'po-2402', stageName: 'Quality Check', stageOrder: 5, expense: 150, wagePerUnit: 3, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-006', orderId: 'po-2402', stageName: 'Packaging', stageOrder: 6, expense: 100, wagePerUnit: 3, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },

  // --- PO-2403 (Aluminum Frame F1) — using wft-denim template, currently at stage 2 ---
  { id: 'ows-007', orderId: 'po-2403', stageName: 'Material Allocation', stageOrder: 1, expense: 300, wagePerUnit: 3, headcount: 2, assignedEmployeeId: 'emp-005', assignedEmployeeName: 'Sofia Ivanova', status: 'Completed' },
  { id: 'ows-008', orderId: 'po-2403', stageName: 'Cutting', stageOrder: 2, expense: 900, wagePerUnit: 12, headcount: 4, assignedEmployeeId: 'emp-008', assignedEmployeeName: 'Omar Farooq', status: 'In Progress' },
  { id: 'ows-009', orderId: 'po-2403', stageName: 'Stitching', stageOrder: 3, expense: 2000, wagePerUnit: 22, headcount: 12, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-010', orderId: 'po-2403', stageName: 'Stone Washing', stageOrder: 4, expense: 1500, wagePerUnit: 20, headcount: 3, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-011', orderId: 'po-2403', stageName: 'Quality Check', stageOrder: 5, expense: 200, wagePerUnit: 5, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-012', orderId: 'po-2403', stageName: 'Packaging', stageOrder: 6, expense: 150, wagePerUnit: 4, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },

  // --- PO-2401 (Gearbox Housing A2) — Pending, template copied but nothing started ---
  { id: 'ows-013', orderId: 'po-2401', stageName: 'Material Allocation', stageOrder: 1, expense: 200, wagePerUnit: 2, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-014', orderId: 'po-2401', stageName: 'Cutting', stageOrder: 2, expense: 500, wagePerUnit: 5, headcount: 3, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-015', orderId: 'po-2401', stageName: 'Stitching', stageOrder: 3, expense: 1200, wagePerUnit: 15, headcount: 8, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-016', orderId: 'po-2401', stageName: 'Printing', stageOrder: 4, expense: 350, wagePerUnit: 6, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-017', orderId: 'po-2401', stageName: 'Quality Check', stageOrder: 5, expense: 150, wagePerUnit: 3, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
  { id: 'ows-018', orderId: 'po-2401', stageName: 'Packaging', stageOrder: 6, expense: 100, wagePerUnit: 3, headcount: 2, assignedEmployeeId: null, assignedEmployeeName: null, status: 'Not Started' },
];