import { FileClock, PackageCheck, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

/**
 * POStatsCards — "Open / Received / Total value" summary row at
 * the top of the Purchase Orders page.
 *
 * "Open" counts anything not yet fully resolved (Draft or Sent —
 * still awaiting action), matching the screenshot's count of 1
 * against 6 total orders where only 1 is Draft/Sent... actually the
 * screenshot shows Open=1 with Sent+Draft=2, so "Open" here reflects
 * orders still in Sent status specifically (awaiting delivery) —
 * Draft is pre-order and excluded. Kept as a simple, explicit filter
 * so the exact definition is easy to adjust later if the business
 * rule differs.
 *
 * @param {Object} props
 * @param {PurchaseOrder[]} props.purchaseOrders
 */
export function POStatsCards({ purchaseOrders }) {
  const open = purchaseOrders.filter((po) => po.status === 'Sent').length;
  const received = purchaseOrders.filter((po) => po.status === 'Received').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard label="Open" value={open} icon={FileClock} accent="info" />
      <StatCard label="Received" value={received} icon={PackageCheck} accent="success" />
      <StatCard label="Total value" value={`$${totalValue.toLocaleString()}`} icon={DollarSign} accent="primary" />
    </div>
  );
}