import { Wallet, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { format } from 'date-fns';

/**
 * WageStatsCards — payroll summary row.
 *
 * "Pending payments" now sums the REMAINING balance across all
 * records (netAmount - amountPaid), not just records with a
 * Pending status — this correctly includes partially-paid records'
 * unpaid portion too.
 *
 * @param {Object} props
 * @param {WageRecord[]} props.wages
 */
export function WageStatsCards({ wages }) {
  const totalPayroll = wages.reduce((sum, w) => sum + w.netAmount, 0);
  const pendingPayments = wages.reduce((sum, w) => sum + (w.netAmount - w.amountPaid), 0);
  const paidThisMonth = wages.reduce((sum, w) => sum + w.amountPaid, 0);

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