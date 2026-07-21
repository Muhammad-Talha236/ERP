import { TrendingUp, TrendingDown, Link2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

/**
 * AccountsStatsCards — "Total Income / Total Expense / Net Profit"
 * summary row, derived from the transactions list.
 *
 * @param {Object} props
 * @param {AccountsTransaction[]} props.transactions
 */
export function AccountsStatsCards({ transactions }) {
  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard label="Total Income" value={`$${totalIncome.toLocaleString()}`} icon={TrendingUp} accent="success" />
      <StatCard label="Total Expense" value={`$${totalExpense.toLocaleString()}`} icon={TrendingDown} accent="danger" />
      <StatCard label="Net Profit" value={`$${netProfit.toLocaleString()}`} icon={Link2} accent="info" />
    </div>
  );
}