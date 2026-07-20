import PropTypes from 'prop-types';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPOStatusVariant, getPOPaymentVariant } from '../utils/purchaseOrderStatusVariant';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ShoppingCart } from 'lucide-react';

const COLUMNS = ['PO #', 'SUPPLIER', 'ITEMS', 'TOTAL', 'STATUS', 'PAYMENT', 'CREATED', ''];

/**
 * POTable — full purchase orders table, matching the design
 * screenshot's columns and badge styling exactly.
 *
 * @param {Object} props
 * @param {PurchaseOrder[]} props.purchaseOrders
 * @param {boolean} props.isLoading
 * @param {(po: PurchaseOrder) => void} props.onViewClick
 */
export function POTable({ purchaseOrders, isLoading, onViewClick }) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="No purchase orders found"
        description="Create your first purchase order to start ordering materials."
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
          {purchaseOrders.map((po) => (
            <tr key={po.id} className="border-b border-border last:border-0">
              <td className="py-4 text-sm font-semibold text-text-primary">{po.poNumber}</td>
              <td className="py-4 text-sm text-text-primary">{po.supplierName}</td>
              <td className="py-4 text-sm text-text-secondary">
                {po.items.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td className="py-4 text-sm font-semibold text-text-primary">
                ${po.totalAmount.toLocaleString()}
              </td>
              <td className="py-4">
                <Badge variant={getPOStatusVariant(po.status)}>{po.status}</Badge>
              </td>
              <td className="py-4">
                <Badge variant={getPOPaymentVariant(po.paymentStatus)}>{po.paymentStatus}</Badge>
              </td>
              <td className="py-4 text-sm text-text-secondary">
                {format(new Date(po.createdDate), 'MMM d')}
              </td>
              <td className="py-4 text-right">
                <Button variant="outline" size="sm" onClick={() => onViewClick(po)}>
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

POTable.propTypes = {
  purchaseOrders: PropTypes.array,
  isLoading: PropTypes.bool,
  onViewClick: PropTypes.func,
};