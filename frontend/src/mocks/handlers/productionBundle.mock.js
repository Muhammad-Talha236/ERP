import { productionBundlesMockData } from '@/mocks/data/productionBundles.mock';
import { bundleStageMovementsMockData } from '@/mocks/data/bundleStageMovements.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let bundles = [...productionBundlesMockData];
let movements = [...bundleStageMovementsMockData];

/**
 * Simulates GET /api/v1/bundles?orderId=
 * @param {string} orderId
 * @returns {Promise<ProductionBundle[]>}
 */
export async function fetchBundlesByOrder(orderId) {
  await wait(300);
  return bundles.filter((b) => b.orderId === orderId);
}

/**
 * Simulates GET /api/v1/bundles/{bundleId}/movements
 * Returns this bundle's full movement history, newest first —
 * this is the raw data behind PO Flow Step 7's "bundle movements" breakdown.
 * @param {string} bundleId
 * @returns {Promise<BundleStageMovement[]>}
 */
export async function fetchBundleMovements(bundleId) {
  await wait(250);
  return movements
    .filter((m) => m.bundleId === bundleId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Simulates GET /api/v1/orders/{orderId}/movements — ALL movements
 * across ALL bundles for one order, for the order-level breakdown view.
 * @param {string} orderId
 * @returns {Promise<BundleStageMovement[]>}
 */
export async function fetchOrderMovements(orderId) {
  await wait(300);
  return movements
    .filter((m) => m.orderId === orderId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Simulates POST /api/v1/bundles/{bundleId}/movements
 *
 * THIS IS PO FLOW STEP 5, IMPLEMENTED DIRECTLY: an employee logs
 * how many units they received for this stage and how many they
 * successfully completed (output), plus any wastage.
 *
 * Side effects, all applied together for consistency:
 *  1. A new BundleStageMovement log row is created (the permanent record).
 *  2. The bundle's own `status` is updated based on whether output
 *     was logged yet (Not Started -> In Progress once received,
 *     In Progress -> Completed once output >= received).
 *
 * @param {string} bundleId
 * @param {{ stageName: string, stageOrder: number, loggedByEmployeeId: string, loggedByEmployeeName: string, quantityReceived: number, quantityOutput: number, quantityWastage: number, remarks?: string }} movementData
 * @returns {Promise<{ bundle: ProductionBundle, movement: BundleStageMovement }>}
 */
export async function logBundleMovement(bundleId, movementData) {
  await wait(DELAY_MS);

  const bundle = bundles.find((b) => b.id === bundleId);
  if (!bundle) throw new Error('Bundle not found.');

  const today = new Date().toISOString().slice(0, 10);

  const movement = {
    id: `mov-${Date.now()}`,
    bundleId,
    orderId: bundle.orderId,
    date: today,
    ...movementData,
  };

  movements = [movement, ...movements];

  // Determine the bundle's new status from what was just logged.
  const isFullyOutput = movementData.quantityOutput >= movementData.quantityReceived;
  const newStatus = isFullyOutput ? 'Completed' : 'In Progress';

  bundles = bundles.map((b) =>
    b.id === bundleId
      ? {
          ...b,
          status: newStatus,
          currentStageOrder: movementData.stageOrder,
          currentStageName: movementData.stageName,
        }
      : b
  );

  return { bundle: bundles.find((b) => b.id === bundleId), movement };
}

/**
 * Simulates PATCH /api/v1/bundles/{bundleId}/assign — assigns or
 * reassigns an employee to a bundle.
 */
export async function assignBundleEmployee(bundleId, { employeeId, employeeName }) {
  await wait(300);

  bundles = bundles.map((b) =>
    b.id === bundleId ? { ...b, assignedEmployeeId: employeeId, assignedEmployeeName: employeeName } : b
  );

  return bundles.find((b) => b.id === bundleId);
}