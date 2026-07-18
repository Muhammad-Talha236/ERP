import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ConsumptionChart } from './components/ConsumptionChart';
import { RecentEntriesTable } from './components/RecentEntriesTable';
import { UsageEntryFormModal } from './components/UsageEntryFormModal';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useDailyUsage } from './hooks/useDailyUsage';

/**
 * DailyUsagePage — the main "Daily Usage" screen: consumption
 * trend chart and a recent-entries breakdown table.
 */
export function DailyUsagePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: entries, isLoading, isError, refetch } = useDailyUsage();

  if (isError) {
    return (
      <AppLayout title="Daily Usage" subtitle="Material consumption trends">
        <ErrorState onRetry={refetch} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Daily Usage" subtitle="Material consumption trends">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>+ Record Usage</Button>
        </div>

        <ConsumptionChart entries={entries ?? []} />

        <RecentEntriesTable entries={entries ?? []} isLoading={isLoading} />
      </div>

      <UsageEntryFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
    </AppLayout>
  );
}