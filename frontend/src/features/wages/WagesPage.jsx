import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WageStatsCards } from './components/WageStatsCards';
import { PayrollOverviewTable } from './components/PayrollOverviewTable';
import { PayWageModal } from './components/PayWageModal';
import { GeneratePayrollModal } from './components/GeneratePayrollModal';
import { AdvancesLoansPanel } from './components/AdvancesLoansPanel';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useWagesOverview } from './hooks/useWagesOverview';
import { useWages } from './hooks/useWages';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

export function WagesPage() {
  // The single source of truth for "which month is being viewed" —
  // everything below (title, table, stats cards) derives from this.
  const [viewedMonth, setViewedMonth] = useState(() => new Date());

  const month = viewedMonth.getMonth() + 1;
  const year = viewedMonth.getFullYear();

  const { data: overview, isLoading, isError, refetch } = useWagesOverview({ month, year });
  // Scoped to the SAME month/year as the table, so stat cards and the
  // payroll table never disagree with each other.
  const { data: wages } = useWages({ month, year });

  const [payModal, setPayModal] = useState({ open: false, wageId: null });
  const [generateModal, setGenerateModal] = useState({ open: false, employeeId: null });

  const monthLabel = format(viewedMonth, 'MMMM yyyy');
  const periodStart = format(startOfMonth(viewedMonth), 'yyyy-MM-dd');
  const periodEnd = format(endOfMonth(viewedMonth), 'yyyy-MM-dd');

  const liveWage = payModal.wageId
    ? (wages ?? []).find((w) => w.id === payModal.wageId) ?? null
    : null;

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
        <WageStatsCards wages={wages ?? []} monthLabel={format(viewedMonth, 'MMM')} />

        <div className="rounded-card border border-border bg-background">
          <div className="px-6 pt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-text-primary">{monthLabel} payroll run</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewedMonth((d) => subMonths(d, 1))}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewedMonth((d) => addMonths(d, 1))}
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          <Button
  size="sm"
  onClick={() =>
    setGenerateModal({
      open: true,
      employeeId: null,
    })
  }
  className="w-full sm:w-auto"
>
  <Plus size={16} className="mr-1.5" />
  Generate Payroll
</Button>
          </div>

          <div className="px-6 pb-6 pt-4">
            <PayrollOverviewTable
              rows={overview}
              isLoading={isLoading}
              onGenerateClick={(row) => setGenerateModal({ open: true, employeeId: row.employeeId })}
              onEditClick={(row) => setGenerateModal({ open: true, employeeId: row.employeeId })}
              onPayClick={(row) => setPayModal({ open: true, wageId: row.wageId })}
            />
          </div>
        </div>

        <AdvancesLoansPanel />
      </div>

      <PayWageModal
        open={payModal.open}
        onOpenChange={(open) => setPayModal({ open, wageId: open ? payModal.wageId : null })}
        wage={liveWage}
      />

      <GeneratePayrollModal
        open={generateModal.open}
        onOpenChange={(open) => setGenerateModal({ open, employeeId: open ? generateModal.employeeId : null })}
        initialEmployeeId={generateModal.employeeId}
        initialPeriodStart={periodStart}
        initialPeriodEnd={periodEnd}
      />
    </AppLayout>
  );
}