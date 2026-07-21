import { accountsTransactionsMockData } from '@/mocks/data/accountsTransactions.mock';
import { monthlyFinancialsMockData } from '@/mocks/data/monthlyFinancials.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let transactions = [...accountsTransactionsMockData];

/**
 * Simulates GET /api/v1/reports/finance — recent transactions list.
 * @param {{ type?: string }} params
 * @returns {Promise<AccountsTransaction[]>}
 */
export async function fetchTransactions(params = {}) {
  await wait(DELAY_MS);

  let result = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (params.type && params.type !== 'all') {
    result = result.filter((t) => t.type === params.type);
  }

  return result;
}

/**
 * Simulates GET /api/v1/reports/finance/monthly — pre-aggregated
 * revenue vs expense chart data.
 * @returns {Promise<MonthlyFinancial[]>}
 */
export async function fetchMonthlyFinancials() {
  await wait(300);
  return [...monthlyFinancialsMockData];
}

/**
 * Simulates POST /api/v1/reports/finance — records a new manual
 * transaction (e.g. logging an expense or income entry directly).
 * @param {Omit<AccountsTransaction, 'id'>} newTransaction
 * @returns {Promise<AccountsTransaction>}
 */
export async function createTransaction(newTransaction) {
  await wait(DELAY_MS);

  const transaction = { id: `txn-${Date.now()}`, ...newTransaction };
  transactions = [transaction, ...transactions];
  return transaction;
}