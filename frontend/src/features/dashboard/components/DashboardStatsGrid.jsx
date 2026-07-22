import { Users, CalendarCheck, Factory, Package, Wallet, TrendingUp } from 'lucide-react';
import { DashboardStatCard } from './DashboardStatCard';
import {
  employeeTrendData,
  attendanceTrendData,
  productionTrendData,
  materialStockTrendData,
  pendingPaymentsTrendData,
  revenueTrendData,
} from '@/mocks/data/dashboardTrends.mock';

/**
 * calcChangePercent — simple first-vs-last comparison across the
 * trend array, used to derive each card's "+X% vs last week" figure.
 */
function calcChangePercent(trendData) {
  const first = trendData[0];
  const last = trendData[trendData.length - 1];
  return Number((((last - first) / first) * 100).toFixed(1));
}

/**
 * DashboardStatsGrid — the 6-card summary grid at the top of the
 * Dashboard, matching the design screenshot exactly.
 *
 * @param {Object} props
 * @param {ReturnType<typeof import('../hooks/useDashboardStats').useDashboardStats>} props.stats
 */
export function DashboardStatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardStatCard
        label="Total Employees"
        value={stats.totalEmployees}
        icon={Users}
        trendData={employeeTrendData}
        changePercent={calcChangePercent(employeeTrendData)}
        lineColor="#3B82F6"
        iconAccent="bg-primary/15 text-primary"
      />
      <DashboardStatCard
        label="Today's Attendance"
        value={stats.todayAttendance}
        icon={CalendarCheck}
        trendData={attendanceTrendData}
        changePercent={calcChangePercent(attendanceTrendData)}
        lineColor="#22C55E"
        iconAccent="bg-success/15 text-success"
      />
      <DashboardStatCard
        label="Active Production"
        value={stats.activeProduction}
        icon={Factory}
        trendData={productionTrendData}
        changePercent={calcChangePercent(productionTrendData)}
        lineColor="#0EA5E9"
        iconAccent="bg-info/15 text-info"
      />
      <DashboardStatCard
        label="Material Stock"
        value={stats.materialStock.toLocaleString()}
        icon={Package}
        trendData={materialStockTrendData}
        changePercent={calcChangePercent(materialStockTrendData)}
        lineColor="#F59E0B"
        iconAccent="bg-warning/15 text-warning"
      />
      <DashboardStatCard
        label="Pending Payments"
        value={`$${stats.pendingPayments.toLocaleString()}`}
        icon={Wallet}
        trendData={pendingPaymentsTrendData}
        changePercent={calcChangePercent(pendingPaymentsTrendData)}
        lineColor="#F59E0B"
        iconAccent="bg-danger/15 text-danger"
      />
      <DashboardStatCard
        label="Monthly Revenue"
        value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
        icon={TrendingUp}
        trendData={revenueTrendData}
        changePercent={calcChangePercent(revenueTrendData)}
        lineColor="#3B82F6"
        iconAccent="bg-primary/15 text-primary"
      />
    </div>
  );
}