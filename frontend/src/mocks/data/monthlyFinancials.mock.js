/**
 * monthlyFinancials.mock.js — pre-aggregated monthly revenue vs
 * expense totals (in $K), powering the "Revenue vs Expenses" chart.
 *
 * @typedef {Object} MonthlyFinancial
 * @property {string} month   - short label, e.g. "Jan"
 * @property {number} revenue - in thousands
 * @property {number} expenses - in thousands
 */

export const monthlyFinancialsMockData = [
  { month: 'Jan', revenue: 320, expenses: 210 },
  { month: 'Feb', revenue: 380, expenses: 240 },
  { month: 'Mar', revenue: 410, expenses: 260 },
  { month: 'Apr', revenue: 395, expenses: 255 },
  { month: 'May', revenue: 460, expenses: 270 },
  { month: 'Jun', revenue: 482, expenses: 290 },
];