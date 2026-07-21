import PropTypes from 'prop-types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Receipt } from 'lucide-react';

const COLUMNS = ['DATE', 'DESCRIPTION', 'TYPE', 'AMOUNT'];

/**
 * TransactionsTable — "Recent transactions" table, matching the
 * design screenshot exactly: green +amount for Income, red -amount
 * for Expense, with a small directional arrow icon per type.
 *
 * @param {Object} props
 * @param {AccountsTransaction[]} props.transactions
 * @param {boolean} props.isLoading
 */
export function TransactionsTable({ transactions, isLoading }) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions found"
        description="Income and expense records will appear here."
      />
    );
  }

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-lg font-bold text-text-primary mb-4">Recent transactions</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((col) => (
              <th key={col} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => {
            const isIncome = txn.type === 'Income';
            return (
              <tr key={txn.id} className="border-b border-border last:border-0">
                <td className="py-4 text-sm text-text-secondary">{format(new Date(txn.date), 'MMM d')}</td>
                <td className="py-4 text-sm font-semibold text-text-primary">{txn.description}</td>
                <td className="py-4">
                  <span className={`flex items-center gap-1 text-sm ${isIncome ? 'text-success' : 'text-danger'}`}>
                    {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {txn.type}
                  </span>
                </td>
                <td className={`py-4 text-sm font-semibold ${isIncome ? 'text-success' : 'text-danger'}`}>
                  {isIncome ? '+' : '-'}${txn.amount.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

TransactionsTable.propTypes = {
  transactions: PropTypes.array,
  isLoading: PropTypes.bool,
};