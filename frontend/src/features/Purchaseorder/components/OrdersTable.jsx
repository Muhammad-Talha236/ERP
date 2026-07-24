import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ShoppingCart } from 'lucide-react';
import { getProductionOrderStatusVariant, getPriorityVariant } from '../utils/productionOrderStatusVariant';

const COLUMNS = ['PO #', 'CUSTOMER', 'PRODUCT', 'QTY', 'PRIORITY', 'STATUS', 'DUE'];

export function OrdersTable({ orders, isLoading }) {
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
};