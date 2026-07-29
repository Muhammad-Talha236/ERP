import { productionBundlesMockData } from '@/mocks/data/productionBundles.mock';
import { bundleStageMovementsMockData } from '@/mocks/data/bundleStageMovements.mock';
import { bundleStageAssignmentsMockData } from '@/mocks/data/bundleStageAssignments.mock';
import { creditProductionWage } from './wage.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let bundles = [...productionBundlesMockData];
let movements = [...bundleStageMovementsMockData];
let bundleStageAssignments = [...bundleStageAssignmentsMockData];

export async function fetchBundlesByOrder(orderId) {
  await wait(300);
  return bundles.filter((b) => b.orderId === orderId);
}

export async function fetchBundleMovements(bundleId) {
  await wait(250);
  return movements.filter((m) => m.bundleId === bundleId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function fetchOrderMovements(orderId) {
  await wait(300);
  return movements.filter((m) => m.orderId === orderId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function logBundleMovement(bundleId, movementData) {
  await wait(DELAY_MS);

  const bundle = bundles.find((b) => b.id === bundleId);
  if (!bundle) throw new Error('Bundle not found.');

  const today = new Date().toISOString().slice(0, 10);
  const movement = { id: `mov-${Date.now()}`, bundleId, orderId: bundle.orderId, date: today, ...movementData };
  movements = [movement, ...movements];

  const isFullyOutput = movementData.quantityOutput >= movementData.quantityReceived;
  bundles = bundles.map((b) =>
    b.id === bundleId
      ? { ...b, status: isFullyOutput ? 'Completed' : 'In Progress', currentStageOrder: movementData.stageOrder, currentStageName: movementData.stageName }
      : b
  );

  return { bundle: bundles.find((b) => b.id === bundleId), movement };
}

export async function assignBundleEmployee(bundleId, { employeeId, employeeName }) {
  await wait(300);
  bundles = bundles.map((b) => (b.id === bundleId ? { ...b, assignedEmployeeId: employeeId, assignedEmployeeName: employeeName } : b));
  return bundles.find((b) => b.id === bundleId);
}

/**
 * Simulates POST /api/v1/orders/{orderId}/bundles/split
 *
 * Splits total quantity into bundles of a given size. If it doesn't
 * divide evenly, the remainder becomes one final smaller bundle —
 * this keeps the TOTAL always equal to the order's real quantity.
 */
export async function splitOrderIntoBundles(orderId, totalQuantity, quantityPerBundle, firstStageName) {
  await wait(DELAY_MS);

  const fullBundleCount = Math.floor(totalQuantity / quantityPerBundle);
  const remainder = totalQuantity % quantityPerBundle;
  const newBundles = [];

  for (let i = 0; i < fullBundleCount; i++) {
    newBundles.push({
      id: `bun-${Date.now()}-${i}`,
      orderId,
      bundleNumber: `B-${orderId.slice(-4)}-${i + 1}`,
      quantity: quantityPerBundle,
      currentStageOrder: 1,
      currentStageName: firstStageName,
      assignedEmployeeId: null,
      assignedEmployeeName: null,
      status: 'Not Started',
    });
  }

  if (remainder > 0) {
    newBundles.push({
      id: `bun-${Date.now()}-rem`,
      orderId,
      bundleNumber: `B-${orderId.slice(-4)}-${fullBundleCount + 1}`,
      quantity: remainder,
      currentStageOrder: 1,
      currentStageName: firstStageName,
      assignedEmployeeId: null,
      assignedEmployeeName: null,
      status: 'Not Started',
    });
  }

  bundles = [...bundles, ...newBundles];
  return newBundles;
}

/**
 * Simulates PUT /api/v1/bundles/{bundleId}
 *
 * FIX: quantity can no longer just disappear. If quantity changes,
 * the DIFFERENCE is moved to/from another bundle in the same order
 * (the last one in the list) — so the sum across all bundles always
 * still equals the order's real total quantity.
 */
export async function updateBundle(bundleId, updates) {
  await wait(300);

  const bundle = bundles.find((b) => b.id === bundleId);
  if (!bundle) throw new Error('Bundle not found.');

  if (updates.quantity !== undefined) {
    const newQty = Number(updates.quantity);
    const delta = bundle.quantity - newQty; // positive if reduced

    if (delta !== 0) {
      const siblings = bundles.filter((b) => b.orderId === bundle.orderId && b.id !== bundleId);
      if (siblings.length === 0) {
        throw new Error('Cannot change quantity — no other bundle exists to absorb the difference.');
      }
      const target = siblings[siblings.length - 1];
      const targetNewQty = target.quantity + delta;
      if (targetNewQty <= 0) {
        throw new Error(`This change would make ${target.bundleNumber}'s quantity invalid.`);
      }
      bundles = bundles.map((b) => {
        if (b.id === bundleId) return { ...b, quantity: newQty };
        if (b.id === target.id) return { ...b, quantity: targetNewQty };
        return b;
      });
      return bundles.find((b) => b.id === bundleId);
    }
  }

  bundles = bundles.map((b) => (b.id === bundleId ? { ...b, ...updates } : b));
  return bundles.find((b) => b.id === bundleId);
}

/**
 * Simulates DELETE /api/v1/bundles/{bundleId}
 *
 * FIX: the deleted bundle's quantity is added to the NEXT remaining
 * bundle, so it's never silently lost. Deleting the only remaining
 * bundle is blocked, since there'd be nowhere for its quantity to go.
 */
export async function deleteBundle(bundleId) {
  await wait(300);

  const bundle = bundles.find((b) => b.id === bundleId);
  if (!bundle) throw new Error('Bundle not found.');

  const siblings = bundles.filter((b) => b.orderId === bundle.orderId && b.id !== bundleId);
  if (siblings.length === 0) {
    throw new Error('Cannot delete the only remaining bundle for this order.');
  }

  const target = siblings[0];
  bundles = bundles
    .filter((b) => b.id !== bundleId)
    .map((b) => (b.id === target.id ? { ...b, quantity: b.quantity + bundle.quantity } : b));

  return { id: bundleId };
}

// ------------------------------------------------------------------
// PER-BUNDLE workflow: each bundle progresses through stages on its
// own, with its own employee assignments, gated sequentially.
// ------------------------------------------------------------------

/** Simulates GET /api/v1/bundles/{bundleId}/assignments */
export async function fetchBundleStageAssignments(bundleId) {
  await wait(200);
  return bundleStageAssignments.filter((a) => a.bundleId === bundleId);
}

/** Simulates POST /api/v1/bundles/{bundleId}/assignments */
export async function addBundleStageAssignment(bundleId, stepId, stageOrder, stageName, employeeId, employeeName) {
  await wait(250);
  const assignment = {
    id: `bsa-${Date.now()}`,
    bundleId, stepId, stageOrder, stageName, employeeId, employeeName,
    isDone: false, completedAt: null,
  };
  bundleStageAssignments = [...bundleStageAssignments, assignment];
  return assignment;
}

/**
 * Simulates POST /api/v1/bundles/{bundleId}/assignments/bulk —
 * assigns multiple employees to the bundle's CURRENT stage at once.
 */
export async function bulkAssignBundleStage(bundleId, stepId, stageOrder, stageName, employees) {
  await wait(300);
  const newAssignments = employees.map((emp, i) => ({
    id: `bsa-${Date.now()}-${i}`,
    bundleId, stepId, stageOrder, stageName,
    employeeId: emp.id, employeeName: emp.name,
    isDone: false, completedAt: null,
  }));
  bundleStageAssignments = [...bundleStageAssignments, ...newAssignments];
  return newAssignments;
}

/**
 * Simulates PATCH /api/v1/bundle-assignments/{id}/complete
 * Also credits the employee's wage for this stage, same as the
 * order-level flow — completing work for a specific bundle still
 * earns real money.
 */
export async function completeBundleStageAssignment(assignmentId, wagePerPerson) {
  await wait(250);

  const assignment = bundleStageAssignments.find((a) => a.id === assignmentId);
  if (!assignment) throw new Error('Assignment not found.');

  bundleStageAssignments = bundleStageAssignments.map((a) =>
    a.id === assignmentId ? { ...a, isDone: true, completedAt: new Date().toISOString().slice(0, 10) } : a
  );

  if (wagePerPerson) {
    creditProductionWage(assignment.employeeId, wagePerPerson);
  }

  return bundleStageAssignments.find((a) => a.id === assignmentId);
}

/**
 * Simulates PATCH /api/v1/bundles/{bundleId}/advance-stage — moves
 * a bundle to the next stage once its current stage's assignments
 * are all done. If it was the last stage, marks the bundle Completed.
 */
export async function advanceBundleStage(bundleId, nextStageOrder, nextStageName, isLastStage) {
  await wait(200);
  bundles = bundles.map((b) =>
    b.id === bundleId
      ? { ...b, currentStageOrder: nextStageOrder, currentStageName: nextStageName, status: isLastStage ? 'Completed' : 'In Progress' }
      : b
  );
  return bundles.find((b) => b.id === bundleId);
}