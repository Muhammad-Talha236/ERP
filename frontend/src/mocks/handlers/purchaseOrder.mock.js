import { purchaseOrdersMockData } from '@/mocks/data/purchaseOrders.mock';
import { poPaymentHistoryMockData } from '@/mocks/data/poPaymentHistory.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let purchaseOrders = [...purchaseOrdersMockData];
let poPaymentHistory = [...poPaymentHistoryMockData];

function derivePaymentStatus(paidAmount, totalAmount) {
  if (paidAmount <= 0) return 'Unpaid';
  if (paidAmount >= totalAmount) return 'Paid';
  return 'Partial';
}

/**
 * Simulates GET /api/v1/purchases
 */
export async function fetchPurchaseOrders(params = {}) {
  await wait(DELAY_MS);
  let result = [...purchaseOrders];
  if (params.status && params.status !== 'all') result = result.filter((po) => po.status === params.status);
  if (params.search) {
    const query = params.search.toLowerCase();
    result = result.filter((po) => po.poNumber.toLowerCase().includes(query) || po.supplierName.toLowerCase().includes(query));
  }
  return result;
}

/**
 * Simulates POST /api/v1/purchases
 */
export async function createPurchaseOrder(newPO) {
  await wait(DELAY_MS);

  const totalAmount = newPO.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const po = {
    id: `po-${Date.now()}`,
    poNumber: `PUR-${8800 + purchaseOrders.length + 1}`,
    totalAmount,
    paidAmount: 0,
    status: 'Draft',
    paymentStatus: 'Unpaid',
    receivedDate: null,
    ...newPO,
  };

  purchaseOrders = [po, ...purchaseOrders];
  return po;
}

/**
 * Simulates PUT /api/v1/purchases/{id} — used for editing basic
 * PO fields (supplier, items, expected delivery date).
 *
 * NOTE: if items are edited, totalAmount is recalculated here —
 * paidAmount is left untouched (past payments don't change just
 * because line items were corrected), but paymentStatus is
 * re-derived against the new total.
 */
export async function updatePurchaseOrder(id, updates) {
  await wait(DELAY_MS);

  purchaseOrders = purchaseOrders.map((po) => {
    if (po.id !== id) return po;

    const merged = { ...po, ...updates };
    if (updates.items) {
      merged.totalAmount = updates.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    }
    merged.paymentStatus = derivePaymentStatus(merged.paidAmount, merged.totalAmount);
    return merged;
  });

  return purchaseOrders.find((po) => po.id === id);
}

/**
 * Simulates PATCH /api/v1/purchases/{id}/receive — marks a PO as
 * Received, stamping today's date.
 */
export async function markPOAsReceived(id) {
  await wait(300);

  purchaseOrders = purchaseOrders.map((po) =>
    po.id === id ? { ...po, status: 'Received', receivedDate: new Date().toISOString().slice(0, 10) } : po
  );

  return purchaseOrders.find((po) => po.id === id);
}

/**
 * Simulates GET /api/v1/purchases/{poId}/payments
 */
export async function fetchPOPaymentHistory(poId) {
  await wait(250);
  return poPaymentHistory.filter((p) => p.poId === poId).sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Simulates POST /api/v1/purchases/{poId}/payments — records a
 * payment or advance against a PO. Same accumulation + validation
 * pattern as recordWagePayment in wage.mock.js.
 *
 * @param {string} poId
 * @param {{ amount: number, type: 'Payment'|'Advance', remarks?: string }} paymentData
 */
export async function recordPOPayment(poId, paymentData) {
  await wait(DELAY_MS);

  const po = purchaseOrders.find((p) => p.id === poId);
  if (!po) throw new Error('Purchase order not found.');

  const remaining = po.totalAmount - po.paidAmount;
  if (paymentData.amount > remaining) {
    throw new Error(`Payment amount cannot exceed the remaining balance of $${remaining}.`);
  }

  const newPaidAmount = po.paidAmount + paymentData.amount;
  const today = new Date().toISOString().slice(0, 10);

  purchaseOrders = purchaseOrders.map((p) =>
    p.id === poId ? { ...p, paidAmount: newPaidAmount, paymentStatus: derivePaymentStatus(newPaidAmount, p.totalAmount) } : p
  );

  const transaction = {
    id: `popay-${Date.now()}`,
    poId,
    type: paymentData.type,
    amount: paymentData.amount,
    date: today,
    remarks: paymentData.remarks || null,
  };

  poPaymentHistory = [transaction, ...poPaymentHistory];

  return { po: purchaseOrders.find((p) => p.id === poId), transaction };
}

/**
 * Simulates PUT /api/v1/po-payments/{transactionId} — edits an
 * existing PO payment/advance. Same difference-based adjustment
 * logic as updatePaymentTransaction in wage.mock.js.
 */
export async function updatePOPaymentTransaction(transactionId, updates) {
  await wait(DELAY_MS);

  const transaction = poPaymentHistory.find((p) => p.id === transactionId);
  if (!transaction) throw new Error('Payment record not found.');

  const po = purchaseOrders.find((p) => p.id === transaction.poId);
  if (!po) throw new Error('Purchase order not found.');

  const amountDifference = updates.amount - transaction.amount;
  const newPaidAmount = po.paidAmount + amountDifference;

  if (newPaidAmount < 0) throw new Error('This edit would make the total paid amount negative.');
  if (newPaidAmount > po.totalAmount) throw new Error(`This edit would exceed the order total of $${po.totalAmount}.`);

  poPaymentHistory = poPaymentHistory.map((p) =>
    p.id === transactionId ? { ...p, amount: updates.amount, remarks: updates.remarks ?? p.remarks } : p
  );

  purchaseOrders = purchaseOrders.map((p) =>
    p.id === po.id ? { ...p, paidAmount: newPaidAmount, paymentStatus: derivePaymentStatus(newPaidAmount, p.totalAmount) } : p
  );

  return { po: purchaseOrders.find((p) => p.id === po.id), transaction: poPaymentHistory.find((p) => p.id === transactionId) };
}