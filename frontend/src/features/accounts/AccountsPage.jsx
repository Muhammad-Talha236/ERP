import { AppLayout } from '@/components/layout/AppLayout';
import { AccountsStatsCards } from './components/AccountsStatsCards';
import { RevenueExpenseChart } from './components/RevenueExpenseChart';
import { TransactionsTable } from './components/TransactionsTable';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useTransactions } from './hooks/useTransactions';
import { useMonthlyFinancials } from './hooks/useMonthlyFinancials';

/**
 * AccountsPage — the main "Accounts" screen: income/expense/profit
 * stat cards, revenue vs expenses chart, and recent transactions.
 */
export function AccountsPage() {
  const { data: transactions, isLoading, isError, refetch } = useTransactions();
  const { data: monthlyData, isLoading: isChartLoading } = useMonthlyFinancials();

  if (isError) {
    return (
      <AppLayout title="Accounts" subtitle="Income, expenses & P/L">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Accounts" subtitle="Income, expenses & P/L">
      <div className="space-y-6">
        <AccountsStatsCards transactions={transactions ?? []} />

        {!isChartLoading && <RevenueExpenseChart data={monthlyData ?? []} />}

        <TransactionsTable transactions={transactions} isLoading={isLoading} />
      </div>
    </AppLayout>
  );
}