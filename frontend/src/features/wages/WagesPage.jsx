import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WageStatsCards } from './components/WageStatsCards';
import { PayrollTable } from './components/PayrollTable';
import { PayWageModal } from './components/PayWageModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useWages } from './hooks/useWages';
import { format } from 'date-fns';

export function WagesPage() {
  const { data: wages, isLoading, isError, refetch } = useWages();
  const [payModal, setPayModal] = useState({ open: false, wage: null });
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

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
          <div className="px-6 pt-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">{monthLabel} payroll run</h3>
            <Button size="sm" onClick={() => setGenerateModalOpen(true)}>
              <Plus size={16} className="mr-1.5" /> Generate Payroll
            </Button>
          </div>

          <div className="px-6 pb-6 pt-4">
            <PayrollTable
              wages={wages}
              isLoading={isLoading}
              onPayClick={(wage) => setPayModal({ open: true, wage })}
            />
          </div>
        </div>
      </div>

      <PayWageModal
        open={payModal.open}
        onOpenChange={(open) => setPayModal({ open, wage: open ? payModal.wage : null })}
        wage={payModal.wage}
      />
    </AppLayout>
  );
}