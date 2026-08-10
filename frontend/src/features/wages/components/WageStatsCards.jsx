import { Wallet, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import PropTypes from 'prop-types';

/**
 * WageStatsCards — payroll summary row for the CURRENTLY VIEWED
 * month (wages passed in are already scoped to that month/year by
 * the parent), not hardcoded to "today".
 */
export function WageStatsCards({ wages, monthLabel }) {
  const totalPayroll = wages.reduce((sum, w) => sum + w.netAmount, 0);
  const pendingPayments = wages.reduce((sum, w) => sum + (w.netAmount - w.amountPaid), 0);
  const paidThisMonth = wages.reduce((sum, w) => sum + w.amountPaid, 0);

  return (
   <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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
    label={`Paid (${monthLabel})`}
    value={`$${paidThisMonth.toLocaleString()}`}
    icon={CheckCircle2}
    accent="success"
  />
</div>
  );
}

WageStatsCards.propTypes = {
  wages: PropTypes.array.isRequired,
  monthLabel: PropTypes.string,
};