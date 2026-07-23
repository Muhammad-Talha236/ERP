import { Clock, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

/**
 * ProductionStatsCards — "Pending / In Progress / Quality Check /
 * Completed" summary row at the top of the Production page.
 *
 * @param {Object} props
 * @param {ProductionOrder[]} props.orders
 */
export function ProductionStatsCards({ orders }) {
  const pending = orders.filter((o) => o.status === 'Pending').length;
  const inProgress = orders.filter((o) => o.status === 'In Progress').length;
  const qualityCheck = orders.filter((o) => o.status === 'Quality Check').length;
  const completed = orders.filter((o) => o.status === 'Completed').length;

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard label="Pending" value={pending} icon={Clock} accent="primary" />
      <StatCard label="In Progress" value={inProgress} icon={Loader2} accent="info" />
      <StatCard label="Quality Check" value={qualityCheck} icon={ShieldCheck} accent="warning" />
      <StatCard label="Completed" value={completed} icon={CheckCircle2} accent="success" />
    </div>
  );
}