import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WageStatsCards } from './components/WageStatsCards';
import { PayrollTable } from './components/PayrollTable';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useWages } from './hooks/useWages';
import { useMarkWageAsPaid } from './hooks/useMarkWageAsPaid';
import { format } from 'date-fns';

/**
 * WagesPage — the main "Wages" screen.
 *
 * Payment is now controlled PER EMPLOYEE via the "Pay" button on
 * each row (useMarkWageAsPaid), not a single bulk action — this
 * matches real payroll behavior where paying one employee should
 * never affect another employee's payment status.
 */
export function WagesPage() {
  const { data: wages, isLoading, isError, refetch } = useWages();
  const { mutate: payWage, isPending, variables: payingId } = useMarkWageAsPaid();

  const monthLabel = format(new Date(), 'MMMM');

  if (isError) {
    return (
      <AppLayout title="Wages" subtitle="Payroll & salary tracking">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Wages" subtitle="Payroll & salary tracking">
      <div className="space-y-6">
        <WageStatsCards wages={wages ?? []} />

        <div className="rounded-card border border-border bg-background">
          <div className="px-6 pt-6">
            <h3 className="text-lg font-bold text-text-primary">{monthLabel} payroll run</h3>
          </div>

          <div className="px-6 pb-6 pt-4">
            <PayrollTable
              wages={wages}
              isLoading={isLoading}
              onPayClick={(id) => payWage(id)}
              payingId={isPending ? payingId : null}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}