import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';

const COLUMNS = ['ORDER', 'PRODUCT', 'ASSIGNEE', 'DUE', 'PROGRESS', 'STATUS'];

/**
 * RecentProductionOrdersTable — "Recent Production Orders / Latest
 * activity from the shop floor" table, reusing real production
 * order data (no separate mock needed — same source as the
 * Production page).
 *
 * @param {Object} props
 * @param {ProductionOrder[]} props.orders
 */
export function RecentProductionOrdersTable({ orders }) {
  const navigate = useNavigate();
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Recent Production Orders</h3>
          <p className="text-sm text-text-secondary">Latest activity from the shop floor</p>
        </div>
        <button
          onClick={() => navigate({ to: '/production' })}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col) => (
                <th key={col} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
              const progressPercent = Math.round((order.currentStageOrder / 6) * 100);
              return (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="py-4 text-sm font-semibold text-text-primary">{order.poNumber}</td>
                  <td className="py-4 text-sm text-text-primary">{order.productName}</td>
                  <td className="py-4 text-sm text-text-secondary">{order.customerName}</td>
                  <td className="py-4 text-sm text-text-secondary">{format(new Date(order.deliveryDate), 'MMM d')}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-surface overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <span className="text-xs text-text-secondary">{progressPercent}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge variant={getProductionOrderStatusVariant(order.status)}>{order.status}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

RecentProductionOrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
};