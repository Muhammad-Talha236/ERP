import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardStatsGrid } from './components/DashboardStatsGrid';
import { ProductionOverviewChart } from './components/ProductionOverviewChart';
import { MaterialUsageDonut } from './components/MaterialUsageDonut';
import { DepartmentAttendanceChart } from './components/DepartmentAttendanceChart';
import { RevenueExpenseChart } from '@/features/accounts/components/RevenueExpenseChart';
import { RecentProductionOrdersTable } from './components/RecentProductionOrdersTable';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useMonthlyFinancials } from '@/features/accounts/hooks/useMonthlyFinancials';

/**
 * DashboardPage — the main "Dashboard" screen: live plant overview
 * composed from data already fetched by every other module.
 *
 * Reuses RevenueExpenseChart directly from the Accounts feature
 * folder rather than duplicating it — since it's the exact same
 * chart with the exact same data, importing it is more maintainable
 * than a second copy that could drift out of sync.
 */
export function DashboardPage() {
  const stats = useDashboardStats();
  const { data: monthlyData, isLoading: isChartLoading } = useMonthlyFinancials();

  if (stats.isLoading) {
    return (
      <AppLayout title="Dashboard" subtitle="Live overview of your plant">
        <LoadingSkeleton rows={6} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard" subtitle="Live overview of your plant">
      <div className="space-y-6">
        <DashboardStatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductionOverviewChart />
          </div>
          <MaterialUsageDonut />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentAttendanceChart />
          {!isChartLoading && <RevenueExpenseChart data={monthlyData ?? []} />}
        </div>

        <RecentProductionOrdersTable orders={stats.productionOrders} />
      </div>
    </AppLayout>
  );
}