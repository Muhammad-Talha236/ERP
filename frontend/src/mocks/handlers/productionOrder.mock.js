import { productionOrdersMockData } from '@/mocks/data/productionOrders.mock';
import { orderWorkflowStepsMockData } from '@/mocks/data/orderWorkflowSteps.mock';
import { workflowTemplatesMockData } from '@/mocks/data/workflowTemplates.mock';
import { creditProductionWage } from './wage.mock';
const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let productionOrders = [...productionOrdersMockData];
let orderWorkflowSteps = [...orderWorkflowStepsMockData];

/**
 * Simulates GET /api/v1/purchase-orders
 * @param {{ status?: string, search?: string, customerId?: string }} params
 * @returns {Promise<ProductionOrder[]>}
 */
export async function fetchProductionOrders(params = {}) {
  await wait(DELAY_MS);

  let result = [...productionOrders];

  if (params.status && params.status !== 'all') {
    result = result.filter((po) => po.status === params.status);
  }
  if (params.customerId) {
    result = result.filter((po) => po.customerId === params.customerId);
  }
  if (params.search) {
    const query = params.search.toLowerCase();
    result = result.filter(
      (po) => po.poNumber.toLowerCase().includes(query) || po.productName.toLowerCase().includes(query)
    );
  }

  return result;
}

/**
 * Simulates GET /api/v1/purchase-orders/{id}
 */
export async function fetchProductionOrderById(id) {
  await wait(250);
  const order = productionOrders.find((po) => po.id === id);
  if (!order) throw new Error('Production order not found.');
  return order;
}
/**
 * Simulates POST /api/v1/purchase-orders
 *
 * Now supports TWO ways to attach a workflow to a new order:
 *  1. workflowTemplateId provided -> stages are copied from that
 *     existing template (previous behavior).
 *  2. customStages provided instead -> those stages are used
 *     directly, exactly as the user built them for this one order.
 *     No template is created/referenced — this is a one-off
 *     workflow that belongs ONLY to this order.
 *
 * @param {{ customerId, customerName, productName, quantity, unitPrice, priority, deliveryDate, workflowTemplateId?: string, customStages?: Array }} newOrder
 * @returns {Promise<ProductionOrder>}
 */
export async function createProductionOrder(newOrder) {
  await wait(DELAY_MS);

  const { workflowTemplateId, customStages, ...orderFields } = newOrder;

  let stageSource;

  if (customStages && customStages.length > 0) {
    // Custom, one-off workflow built by the user for this order only.
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

  return order;
}

/**
 * Simulates PATCH /api/v1/purchase-orders/{id}/status — moves the
 * order's overall stage forward (used by the Kanban board's
 * drag-between-columns interaction, or a "move to next stage" button).
 */
export async function updateProductionOrderStage(id, { currentStageOrder, status }) {
  await wait(300);

  productionOrders = productionOrders.map((po) =>
    po.id === id ? { ...po, currentStageOrder, status } : po
  );

  return productionOrders.find((po) => po.id === id);
}

/**
 * Simulates GET /api/v1/purchase-orders/{orderId}/steps
 * Returns this order's OWN workflow steps (not the template's).
 * @param {string} orderId
 * @returns {Promise<OrderWorkflowStep[]>}
 */
export async function fetchOrderWorkflowSteps(orderId) {
  await wait(250);
  return orderWorkflowSteps
    .filter((s) => s.orderId === orderId)
    .sort((a, b) => a.stageOrder - b.stageOrder);
}

/**
 * Simulates PUT /api/v1/purchase-order-steps/{stepId}
 *
 * THIS IS PO FLOW STEP 4: editing one step's price/expense/assigned
 * employee/wage — scoped to ONLY this order, since orderWorkflowSteps
 * rows belong to one order each (never shared).
 *
 * @param {string} stepId
 * @param {Partial<OrderWorkflowStep>} updates
 * @returns {Promise<OrderWorkflowStep>}
 */
export async function updateOrderWorkflowStep(stepId, updates) {
  await wait(DELAY_MS);

  orderWorkflowSteps = orderWorkflowSteps.map((s) =>
    s.id === stepId ? { ...s, ...updates } : s
  );

  return orderWorkflowSteps.find((s) => s.id === stepId);
}
// --- Add these imports at the top ---
import { stageAssignmentsMockData } from '@/mocks/data/stageAssignments.mock';

// --- Add this mutable state alongside the existing ones ---
let stageAssignments = [...stageAssignmentsMockData];

/**
 * Simulates GET /api/v1/workflow-steps/{stepId}/assignments
 * Returns every individual employee assigned to this ONE step.
 * @param {string} stepId
 * @returns {Promise<StageAssignment[]>}
 */
export async function fetchStageAssignments(stepId) {
  await wait(200);
  return stageAssignments.filter((a) => a.stepId === stepId);
}

/**
 * Simulates POST /api/v1/workflow-steps/{stepId}/assignments —
 * assigns an additional employee to a step (used when headcount > 1
 * and multiple people work the same stage independently).
 */
export async function addStageAssignment(stepId, { employeeId, employeeName }) {
  await wait(300);

  const assignment = {
    id: `sa-${Date.now()}`,
    stepId,
    employeeId,
    employeeName,
    isDone: false,
    completedAt: null,
  };

  stageAssignments = [...stageAssignments, assignment];
  return assignment;
}

/**
 * Simulates PATCH /api/v1/stage-assignments/{id}/complete — marks
 * ONE employee's portion of a step as done.
 *
 * IMPORTANT: this does NOT directly mark the parent step as
 * Completed — that decision is made by the caller (see
 * deriveStepCompletion in the frontend utils), which checks whether
 * ALL assignments under a step are done before advancing the step
 * itself. This keeps the "many employees, one step" rule enforced
 * consistently regardless of which employee finishes last.
 */
/**
 * Simulates PATCH /api/v1/stage-assignments/{id}/complete
 *
 * Also credits the employee's wage record with that stage's
 * wagePerPerson amount — completing work directly increases how
 * much they're owed.
 */
export async function completeStageAssignment(assignmentId) {
  await wait(250);

  const assignment = stageAssignments.find((a) => a.id === assignmentId);
  if (!assignment) throw new Error('Assignment not found.');

  const step = orderWorkflowSteps.find((s) => s.id === assignment.stepId);

  stageAssignments = stageAssignments.map((a) =>
    a.id === assignmentId ? { ...a, isDone: true, completedAt: new Date().toISOString().slice(0, 10) } : a
  );  

  if (step) {
    creditProductionWage(assignment.employeeId, step.wagePerPerson);
  }

  return stageAssignments.find((a) => a.id === assignmentId);
}

// --- Add these to the existing file ---

/**
 * Simulates POST /api/v1/workflow-steps/{stepId}/qc-approve — admin
 * approves Quality Check, marking that step Completed for good.
 * @param {string} stepId
 */
export async function approveQualityCheck(stepId) {
  await wait(300);

  orderWorkflowSteps = orderWorkflowSteps.map((s) =>
    s.id === stepId ? { ...s, status: 'Completed' } : s
  );

  return orderWorkflowSteps.find((s) => s.id === stepId);
}

/**
 * Simulates POST /api/v1/workflow-steps/{stepId}/qc-reject — admin
 * rejects Quality Check. The step itself goes back to 'In Progress'
 * (not Completed), and every individual employee assignment under
 * it is reset to NOT done — meaning the team must redo their work
 * before Quality Check can be attempted again.
 * @param {string} stepId
 */
export async function rejectQualityCheck(stepId) {
  await wait(300);

  orderWorkflowSteps = orderWorkflowSteps.map((s) =>
    s.id === stepId ? { ...s, status: 'In Progress' } : s
  );

  stageAssignments = stageAssignments.map((a) =>
    a.stepId === stepId ? { ...a, isDone: false, completedAt: null } : a
  );

  return orderWorkflowSteps.find((s) => s.id === stepId);
}