import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ShoppingCart } from 'lucide-react';
import { getProductionOrderStatusVariant, getPriorityVariant } from '../utils/productionOrderStatusVariant';

const COLUMNS = ['PO #', 'CUSTOMER', 'PRODUCT', 'QTY', 'PRIORITY', 'STATUS', 'DUE', ''];

/**
 * OrdersTable — simple list view of all production orders.
 * The Kanban board (separate page now) is the visual/status view;
 * this table is the data-dense list view, matching how Purchase
 * Orders and Employees already work.
 *
 * @param {Object} props
 * @param {ProductionOrder[]} props.orders
 * @param {boolean} props.isLoading
 * @param {(order: ProductionOrder) => void} props.onViewClick
 */
export function OrdersTable({ orders, isLoading, onViewClick }) {
  if (isLoading) return <LoadingSkeleton rows={5} />;

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="No orders found"
        description="Create your first production order to get started."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-background p-6">
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
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0">
              <td className="py-4 text-sm font-semibold text-text-primary">{order.poNumber}</td>
              <td className="py-4 text-sm text-text-primary">{order.customerName}</td>
              <td className="py-4 text-sm text-text-secondary">{order.productName}</td>
              <td className="py-4 text-sm text-text-secondary">{order.quantity.toLocaleString()}</td>
              <td className="py-4"><Badge variant={getPriorityVariant(order.priority)}>{order.priority}</Badge></td>
              <td className="py-4"><Badge variant={getProductionOrderStatusVariant(order.status)}>{order.status}</Badge></td>
              <td className="py-4 text-sm text-text-secondary">{format(new Date(order.deliveryDate), 'MMM d')}</td>
              <td className="py-4 text-right">
                <Button variant="outline" size="sm" onClick={() => onViewClick(order)}>
                  <Eye size={14} /> View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

OrdersTable.propTypes = {
  orders: PropTypes.array,
  isLoading: PropTypes.bool,
  onViewClick: PropTypes.func,
};