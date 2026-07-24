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

/**
 * Simulates POST /api/v1/orders/{orderId}/bundles/split
 *
 * Splits an order's total quantity into multiple bundles of a given
 * size. If the total doesn't divide evenly, the LAST bundle absorbs
 * the remainder (e.g. 1000 units / 300 per bundle = 3 full bundles
 * of 300 + 1 final bundle of 100), so nothing is lost.
 *
 * Every new bundle starts unassigned, at stage order 1 (Material
 * Allocation is assumed as the pipeline's first stage name — the
 * actual name is passed in since it depends on the order's own steps).
 *
 * @param {string} orderId
 * @param {number} totalQuantity
 * @param {number} quantityPerBundle
 * @param {string} firstStageName
 * @returns {Promise<ProductionBundle[]>} the newly created bundles
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
 * Simulates PUT /api/v1/bundles/{bundleId} — edits an existing
 * bundle's quantity.
 * @param {string} bundleId
 * @param {{ quantity: number }} updates
 */
export async function updateBundle(bundleId, updates) {
  await wait(300);
  bundles = bundles.map((b) => (b.id === bundleId ? { ...b, ...updates } : b));
  return bundles.find((b) => b.id === bundleId);
}

/**
 * Simulates DELETE /api/v1/bundles/{bundleId}
 * @param {string} bundleId
 */
export async function deleteBundle(bundleId) {
  await wait(300);
  bundles = bundles.filter((b) => b.id !== bundleId);
  return { id: bundleId };
}