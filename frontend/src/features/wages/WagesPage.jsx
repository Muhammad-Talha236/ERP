import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WageStatsCards } from './components/WageStatsCards';
import { PayrollOverviewTable } from './components/PayrollOverviewTable';
import { PayWageModal } from './components/PayWageModal';
import { GeneratePayrollModal } from './components/GeneratePayrollModal';
import { AdvancesLoansPanel } from './components/AdvancesLoansPanel';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useWagesOverview } from './hooks/useWagesOverview';
import { useWages } from './hooks/useWages';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export function WagesPage() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const { data: overview, isLoading, isError, refetch } = useWagesOverview({ month, year });
  // Still used for the top stats cards (aggregates across records) and
  // to feed PayWageModal a "live" wage object after mutations.
  const { data: wages } = useWages();

  const [payModal, setPayModal] = useState({ open: false, wageId: null });
  const [generateModal, setGenerateModal] = useState({ open: false, employeeId: null });

  const monthLabel = format(today, 'MMMM');
  const periodStart = format(startOfMonth(today), 'yyyy-MM-dd');
  const periodEnd = format(endOfMonth(today), 'yyyy-MM-dd');

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
        <WageStatsCards wages={wages ?? []} />

        <div className="rounded-card border border-border bg-background">
          <div className="px-6 pt-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">{monthLabel} payroll run</h3>
            <Button size="sm" onClick={() => setGenerateModal({ open: true, employeeId: null })}>
              <Plus size={16} className="mr-1.5" /> Generate Payroll
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