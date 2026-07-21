/**
 * accountsTransactions.mock.js — fake financial transaction records
 * for the Accounts module.
 *
 * @typedef {Object} AccountsTransaction
 * @property {string} id
 * @property {string} date            - ISO date string
 * @property {string} description
 * @property {'Income'|'Expense'} type
 * @property {number} amount          - always positive; sign is derived from type
 * @property {string|null} category   - e.g. "Sales", "Payroll", "Materials", "Facility"
 */

export const accountsTransactionsMockData = [
  { id: 'txn-001', date: '2026-07-14', description: 'Invoice #INV-2201 — Acme Corp', type: 'Income', amount: 24800, category: 'Sales' },
  { id: 'txn-002', date: '2026-07-13', description: 'Raw material — IronCore Ltd.', type: 'Expense', amount: 18420, category: 'Materials' },
  { id: 'txn-003', date: '2026-07-12', description: 'Payroll batch (partial)', type: 'Expense', amount: 22140, category: 'Payroll' },
  { id: 'txn-004', date: '2026-07-12', description: 'Invoice #INV-2200 — MetalWorks', type: 'Income', amount: 15600, category: 'Sales' },
  { id: 'txn-005', date: '2026-07-10', description: 'Facility maintenance', type: 'Expense', amount: 3200, category: 'Facility' },
  { id: 'txn-006', date: '2026-07-09', description: 'Invoice #INV-2199 — Zenith Motors', type: 'Income', amount: 32400, category: 'Sales' },
];