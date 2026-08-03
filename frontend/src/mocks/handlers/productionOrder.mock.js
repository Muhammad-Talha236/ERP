import { workflowTemplatesMockData } from '@/mocks/data/workflowTemplates.mock';
import { productionOrdersMockData } from '@/mocks/data/productionOrders.mock';
import { orderWorkflowStepsMockData } from '@/mocks/data/orderWorkflowSteps.mock';
import { creditProductionWage } from './wage.mock';
// Intentional circular import — see the matching comment in
// productionBundle.mock.js. Safe because everything below is only
// called from inside function bodies, never at module load time.
import { createDefaultBundleForOrder, syncBundlesFirstStageName } from './productionBundle.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let productionOrders = [...productionOrdersMockData];
let orderWorkflowSteps = [...orderWorkflowStepsMockData];
let stageAssignments = [];

export async function fetchProductionOrders(params = {}) {
  await wait(DELAY_MS);
  let result = [...productionOrders];
  if (params.status && params.status !== 'all') result = result.filter((po) => po.status === params.status);
  if (params.customerId) result = result.filter((po) => po.customerId === params.customerId);
  if (params.search) {
    const query = params.search.toLowerCase();
    result = result.filter((po) => po.poNumber.toLowerCase().includes(query) || po.productName.toLowerCase().includes(query));
  }
  return result;
}

export async function fetchProductionOrderById(id) {
  await wait(250);
  const order = productionOrders.find((po) => po.id === id);
  if (!order) throw new Error('Production order not found.');
  return order;
}

/**
 * Simulates POST /api/v1/purchase-orders
 *
 * After creating the order and copying its workflow steps (from an
 * existing template OR a custom stage list), a DEFAULT BUNDLE is
 * automatically created holding the order's full quantity — bundle-
 * level tracking now starts immediately, no manual "split into
 * bundles" step required first.
 */
export async function createProductionOrder(newOrder) {
  await wait(DELAY_MS);

  const { workflowTemplateId, customStages, ...orderFields } = newOrder;

  let stageSource;
  if (customStages && customStages.length > 0) {
    stageSource = [...customStages].sort((a, b) => a.position - b.position);
  } else {
    const template = workflowTemplatesMockData.find((t) => t.id === workflowTemplateId);
    if (!template) throw new Error('Workflow template not found.');
    stageSource = template.stages;
  }

  const nextNumber = 2400 + productionOrders.length + 1;

  const order = {
    id: `po-${Date.now()}`,
    poNumber: `PO-${nextNumber}`,
    currentStageOrder: 1,
    status: 'Pending',
    orderDate: new Date().toISOString().slice(0, 10),
    workflowTemplateId: workflowTemplateId ?? null,
    ...orderFields,
  };

  productionOrders = [order, ...productionOrders];

  const newSteps = stageSource.map((stage, index) => ({
    id: `ows-${Date.now()}-${index}`,
    orderId: order.id,
    stageName: stage.stageName,
    stageOrder: index + 1,
    expense: stage.stageExpense,
    wagePerPerson: stage.wagePerPerson,
    headcount: stage.headcount,
    assignedEmployeeId: null,
    assignedEmployeeName: null,
    status: 'Not Started',
  }));

  orderWorkflowSteps = [...orderWorkflowSteps, ...newSteps];

  await createDefaultBundleForOrder(order.id, order.quantity, newSteps[0].stageName);

  return order;
}

/** Called by productionBundle.mock.js after any bundle event, to keep order.status in sync. */
/**
 * Called whenever bundle events change an order's derived status.
 * Now also STAMPS receivedDate/completedDate automatically:
 *  - receivedDate is set the FIRST time status leaves 'Pending'
 *  - completedDate is set the FIRST time status becomes 'Completed'
 * Both are set once and never overwritten, so re-triggering the
 * same status change later doesn't reset the original date.
 */
export async function updateProductionOrderStage(id, { currentStageOrder, status }) {
  await wait(200);

  const today = new Date().toISOString().slice(0, 10);

  productionOrders = productionOrders.map((po) => {
    if (po.id !== id) return po;

    const updates = { currentStageOrder, status };
    if (status !== 'Pending' && !po.receivedDate) updates.receivedDate = today;
    if (status === 'Completed' && !po.completedDate) updates.completedDate = today;

    return { ...po, ...updates };
  });

  return productionOrders.find((po) => po.id === id);
}
/**
 * Simulates GET /api/v1/purchase-order-steps — ALL steps across ALL
 * orders in one call, used by the Kanban page to compute each
 * order's total expense without needing N separate per-order fetches.
 */
export async function fetchAllOrderWorkflowSteps() {
  await wait(300);
  return [...orderWorkflowSteps];
}
export async function fetchOrderWorkflowSteps(orderId) {
  await wait(250);
  return orderWorkflowSteps.filter((s) => s.orderId === orderId).sort((a, b) => a.stageOrder - b.stageOrder);
}

export async function updateOrderWorkflowStep(stepId, updates) {
  await wait(DELAY_MS);
  orderWorkflowSteps = orderWorkflowSteps.map((s) => (s.id === stepId ? { ...s, ...updates } : s));
  return orderWorkflowSteps.find((s) => s.id === stepId);
}

/**
 * Structure editing (add/remove/rename/reposition stages), still
 * only usable while nothing has started. If stage 1 is renamed,
 * syncs any not-yet-started bundle's stored stage name so it
 * doesn't go stale.
 */
export async function replaceOrderWorkflowStructure(orderId, steps) {
  await wait(DELAY_MS);

  const sorted = [...steps].sort((a, b) => a.position - b.position);
  const newSteps = sorted.map((s, index) => ({
    id: s.id ?? `ows-${Date.now()}-${index}`,
    orderId,
    stageName: s.stageName,
    stageOrder: index + 1,
    expense: s.expense,
    wagePerPerson: s.wagePerPerson,
    headcount: s.headcount,
    assignedEmployeeId: null,
    assignedEmployeeName: null,
    status: 'Not Started',
  }));

  orderWorkflowSteps = orderWorkflowSteps.filter((s) => s.orderId !== orderId).concat(newSteps);
  syncBundlesFirstStageName(orderId, newSteps[0].stageName);

  return newSteps;
}

// --- Order-scope assignment functions kept for backward
// compatibility (no longer wired to any UI now that per-bundle
// assignment is the only path — see AssignEmployeesModal). ---

export async function fetchStageAssignments(stepId) {
  await wait(200);
  return stageAssignments.filter((a) => a.stepId === stepId);
}

export async function addStageAssignment(stepId, { employeeId, employeeName }) {
  await wait(300);
  const assignment = { id: `sa-${Date.now()}`, stepId, employeeId, employeeName, isDone: false, completedAt: null };
  stageAssignments = [...stageAssignments, assignment];
  return assignment;
}

export async function completeStageAssignment(assignmentId) {
  await wait(250);
  const assignment = stageAssignments.find((a) => a.id === assignmentId);
  if (!assignment) throw new Error('Assignment not found.');
  const step = orderWorkflowSteps.find((s) => s.id === assignment.stepId);
  stageAssignments = stageAssignments.map((a) =>
    a.id === assignmentId ? { ...a, isDone: true, completedAt: new Date().toISOString().slice(0, 10) } : a
  );
  if (step) creditProductionWage(assignment.employeeId, step.wagePerPerson);
  return stageAssignments.find((a) => a.id === assignmentId);
}

export async function approveQualityCheck(stepId) {
  await wait(300);
  orderWorkflowSteps = orderWorkflowSteps.map((s) => (s.id === stepId ? { ...s, status: 'Completed' } : s));
  return orderWorkflowSteps.find((s) => s.id === stepId);
}

export async function rejectQualityCheck(stepId) {
  await wait(300);
  orderWorkflowSteps = orderWorkflowSteps.map((s) => (s.id === stepId ? { ...s, status: 'In Progress' } : s));
  stageAssignments = stageAssignments.map((a) => (a.stepId === stepId ? { ...a, isDone: false, completedAt: null } : a));
  return orderWorkflowSteps.find((s) => s.id === stepId);
}