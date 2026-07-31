import { productionBundlesMockData } from '@/mocks/data/productionBundles.mock';
import { bundleStageMovementsMockData } from '@/mocks/data/bundleStageMovements.mock';
import { bundleStageAssignmentsMockData } from '@/mocks/data/bundleStageAssignments.mock';
import { creditProductionWage } from './wage.mock';
// NOTE: intentional circular import with productionOrder.mock.js —
// this file needs updateProductionOrderStage to recompute order
// status after bundle events, and productionOrder.mock.js needs
// createDefaultBundleForOrder from here when a new order is created.
// Safe because both imports are only ever CALLED inside function
// bodies (never used at module top-level), so by the time either
// runs, both modules have finished loading.
import { updateProductionOrderStage } from './productionOrder.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let bundles = [...productionBundlesMockData];
let movements = [...bundleStageMovementsMockData];
let bundleStageAssignments = [...bundleStageAssignmentsMockData];

/**
 * computeOrderStatusFromBundles — derives an order's overall status
 * purely from the state of its bundles. This is what makes the
 * Kanban's order-level rollup (and the "Pending -> In Progress the
 * moment ONE employee is assigned" requirement) automatic — no UI
 * ever sets order.status directly anymore, it's always recomputed.
 */
/**
 * computeOrderStatusFromBundles — derives an order's overall status
 * purely from bundle state. Simplified to 3 states only:
 * Pending -> In Progress -> Completed. "Quality Check" was removed
 * as a distinct order-level status since it added confusion without
 * real value at this level — QC is still tracked correctly as a
 * per-bundle STAGE, just no longer surfaced as a separate order status.
 */
function computeOrderStatusFromBundles(orderBundles) {
  if (orderBundles.length === 0) return { status: 'Pending', currentStageOrder: 1 };

  const allCompleted = orderBundles.every((b) => b.status === 'Completed');
  if (allCompleted) {
    return { status: 'Completed', currentStageOrder: Math.max(...orderBundles.map((b) => b.currentStageOrder)) };
  }

  const allNotStarted = orderBundles.every((b) => b.status === 'Not Started');
  if (allNotStarted) return { status: 'Pending', currentStageOrder: 1 };

  return { status: 'In Progress', currentStageOrder: Math.max(...orderBundles.map((b) => b.currentStageOrder)) };
}

async function recomputeOrderStatus(orderId) {
  const orderBundles = bundles.filter((b) => b.orderId === orderId);
  const progress = computeOrderStatusFromBundles(orderBundles);
  await updateProductionOrderStage(orderId, progress);
}

/** Simulates GET /api/v1/bundles?orderId= */
export async function fetchBundlesByOrder(orderId) {
  await wait(300);
  return bundles.filter((b) => b.orderId === orderId);
}

/** Simulates GET /api/v1/bundles — ALL bundles, all orders (Kanban) */
export async function fetchAllBundles() {
  await wait(350);
  return [...bundles];
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

  await recomputeOrderStatus(bundle.orderId);

  return { bundle: bundles.find((b) => b.id === bundleId), movement };
}

/**
 * Simulates POST /api/v1/orders/{orderId}/bundles/default — called
 * automatically when a production order is created (from
 * productionOrder.mock.js), seeding Bundle 1 with the order's full
 * quantity so bundle-level tracking has something to work with
 * immediately, no manual setup required.
 */
export async function createDefaultBundleForOrder(orderId, quantity, firstStageName) {
  const bundle = {
    id: `bun-${Date.now()}`,
    orderId,
    bundleNumber: `B-${orderId.slice(-4)}-1`,
    quantity,
    currentStageOrder: 1,
    currentStageName: firstStageName,
    assignedEmployeeId: null,
    assignedEmployeeName: null,
    status: 'Not Started',
  };
  bundles = [...bundles, bundle];
  return bundle;
}

/**
 * If an order's structure is edited (stage 1 renamed) before any
 * bundle has started, that bundle's stored currentStageName would
 * otherwise go stale. Called from replaceOrderWorkflowStructure.
 */
export function syncBundlesFirstStageName(orderId, firstStageName) {
  bundles = bundles.map((b) =>
    b.orderId === orderId && b.status === 'Not Started' && b.currentStageOrder === 1
      ? { ...b, currentStageName: firstStageName }
      : b
  );
}

/**
 * Simulates POST /api/v1/bundles/{sourceBundleId}/split
 *
 * Creates a NEW bundle by carving `quantity` out of an EXISTING
 * bundle — this replaces the old "divide the whole order into N
 * bundles" behavior. The source bundle's quantity shrinks by exactly
 * the new bundle's quantity, so the total across all bundles for the
 * order never changes.
 */
export async function createBundleFromSource(orderId, sourceBundleId, quantity, firstStageName) {
  await wait(DELAY_MS);

  const source = bundles.find((b) => b.id === sourceBundleId && b.orderId === orderId);
  if (!source) throw new Error('Source bundle not found.');
  if (quantity <= 0) throw new Error('Quantity must be greater than 0.');
  if (quantity >= source.quantity) {
    throw new Error(`New bundle quantity must be less than ${source.bundleNumber}'s current quantity of ${source.quantity}.`);
  }

  const remainingQuantity = source.quantity - quantity;
  const orderBundleCount = bundles.filter((b) => b.orderId === orderId).length;

  const newBundle = {
    id: `bun-${Date.now()}`,
    orderId,
    bundleNumber: `B-${orderId.slice(-4)}-${orderBundleCount + 1}`,
    quantity,
    currentStageOrder: 1,
    currentStageName: firstStageName,
    assignedEmployeeId: null,
    assignedEmployeeName: null,
    status: 'Not Started',
  };

  bundles = bundles.map((b) => (b.id === sourceBundleId ? { ...b, quantity: remainingQuantity } : b));
  bundles = [...bundles, newBundle];

  return newBundle;
}

export async function updateBundle(bundleId, updates) {
  await wait(300);

  const bundle = bundles.find((b) => b.id === bundleId);
  if (!bundle) throw new Error('Bundle not found.');

  if (updates.quantity !== undefined) {
    const newQty = Number(updates.quantity);
    const delta = bundle.quantity - newQty;

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

  await recomputeOrderStatus(bundle.orderId);

  return { id: bundleId };
}

/** Simulates GET /api/v1/bundles/{bundleId}/assignments */
export async function fetchBundleStageAssignments(bundleId) {
  await wait(200);
  return bundleStageAssignments.filter((a) => a.bundleId === bundleId);
}

/**
 * Simulates POST /api/v1/bundles/{bundleId}/assignments — assigns
 * ONE employee to ONE stage of ONE bundle. Also flips the bundle's
 * status from 'Not Started' to 'In Progress' the moment the FIRST
 * assignment happens (this is what makes the order-level Kanban tag
 * move off "Pending" as soon as one employee is assigned).
 */
export async function addBundleStageAssignment(bundleId, stepId, stageOrder, stageName, employeeId, employeeName) {
  await wait(250);

  const assignment = {
    id: `bsa-${Date.now()}`,
    bundleId, stepId, stageOrder, stageName, employeeId, employeeName,
    isDone: false, completedAt: null,
  };
  bundleStageAssignments = [...bundleStageAssignments, assignment];

  const bundle = bundles.find((b) => b.id === bundleId);
  if (bundle && bundle.status === 'Not Started') {
    bundles = bundles.map((b) => (b.id === bundleId ? { ...b, status: 'In Progress' } : b));
  }
  if (bundle) await recomputeOrderStatus(bundle.orderId);

  return assignment;
}

/**
 * Simulates POST /api/v1/bundles/{bundleId}/assignments/bulk — the
 * "Bulk Assign All Stages" action: many employees across many stages
 * saved in ONE operation. Does NOT let anyone skip ahead — it only
 * pre-populates who will work each stage; sequential completion
 * rules are enforced elsewhere (BundleWorkflowModal only shows
 * Mark-done controls for the current active stage).
 */
export async function bulkAssignBundleStages(bundleId, assignmentsByStep) {
  await wait(400);

  const bundle = bundles.find((b) => b.id === bundleId);
  if (!bundle) throw new Error('Bundle not found.');

  const newAssignments = [];
  assignmentsByStep.forEach(({ stepId, stageOrder, stageName, employees }) => {
    employees.forEach((emp, i) => {
      newAssignments.push({
        id: `bsa-${Date.now()}-${stepId}-${i}`,
        bundleId, stepId, stageOrder, stageName,
        employeeId: emp.id, employeeName: emp.name,
        isDone: false, completedAt: null,
      });
    });
  });
  bundleStageAssignments = [...bundleStageAssignments, ...newAssignments];

  if (bundle.status === 'Not Started' && newAssignments.length > 0) {
    bundles = bundles.map((b) => (b.id === bundleId ? { ...b, status: 'In Progress' } : b));
  }

  await recomputeOrderStatus(bundle.orderId);

  return newAssignments;
}

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

export async function advanceBundleStage(bundleId, nextStageOrder, nextStageName, isLastStage) {
  await wait(200);

  bundles = bundles.map((b) =>
    b.id === bundleId
      ? { ...b, currentStageOrder: nextStageOrder, currentStageName: nextStageName, status: isLastStage ? 'Completed' : 'In Progress' }
      : b
  );

  const bundle = bundles.find((b) => b.id === bundleId);
  if (bundle) await recomputeOrderStatus(bundle.orderId);

  return bundle;
}