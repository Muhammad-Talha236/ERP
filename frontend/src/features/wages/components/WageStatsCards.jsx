import { Wallet, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { format } from 'date-fns';

/**
 * WageStatsCards — "Total payroll / Pending payments / Paid this
 * month" summary row at the top of the Wages page.
 *
 * All three figures are computed from the wages array passed in,
 * guaranteeing they always match the table below.
 *
 * @param {Object} props
 * @param {WageRecord[]} props.wages
 */
export function WageStatsCards({ wages }) {
  const totalPayroll = wages.reduce((sum, w) => sum + w.netAmount, 0);

  const pendingPayments = wages
    .filter((w) => w.paymentStatus === 'Pending' || w.paymentStatus === 'Processing')
    .reduce((sum, w) => sum + w.netAmount, 0);

  const paidThisMonth = wages
    .filter((w) => w.paymentStatus === 'Paid')
    .reduce((sum, w) => sum + w.netAmount, 0);

  const monthLabel = format(new Date(), 'MMM');

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard
        label={`Total payroll (${monthLabel})`}
        value={`$${totalPayroll.toLocaleString()}`}
        icon={Wallet}
        accent="primary"
      />
      <StatCard
        label="Pending payments"
        value={`$${pendingPayments.toLocaleString()}`}
        icon={Clock}
        accent="warning"
      />
      <StatCard
        label="Paid this month"
        value={`$${paidThisMonth.toLocaleString()}`}
        icon={CheckCircle2}
        accent="success"
      />
    </div>
  );
}