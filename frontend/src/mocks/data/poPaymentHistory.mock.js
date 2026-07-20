/**
 * poPaymentHistory.mock.js — payment/advance transaction log for
 * purchase orders. Same pattern as paymentHistory.mock.js (Wages).
 *
 * @typedef {Object} POPaymentTransaction
 * @property {string} id
 * @property {string} poId
 * @property {'Payment'|'Advance'} type
 * @property {number} amount
 * @property {string} date
 * @property {string|null} remarks
 */

export const poPaymentHistoryMockData = [
  { id: 'popay-001', poId: 'po-8801', type: 'Advance', amount: 5000, date: '2026-07-08', remarks: 'Advance to confirm order' },
  { id: 'popay-002', poId: 'po-8801', type: 'Payment', amount: 13420, date: '2026-07-14', remarks: 'Balance on delivery' },
  { id: 'popay-003', poId: 'po-8803', type: 'Advance', amount: 10000, date: '2026-07-11', remarks: 'Advance for bulk order' },
  { id: 'popay-004', poId: 'po-8805', type: 'Payment', amount: 5480, date: '2026-07-19', remarks: 'Full payment on receipt' },
];