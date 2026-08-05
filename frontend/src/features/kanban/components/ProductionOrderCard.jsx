import PropTypes from 'prop-types';
import { Calendar, DollarSign, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { getPriorityVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';

/**
 * ProductionOrderCard — compact summary only: total expense, and a
 * single overall "X in / Y out" line. Per-stage detail (which
 * bundles are where) lives ONLY in OrderSummaryModal, so the card
 * layout stays clean regardless of how many stages an order has.
 */
export function ProductionOrderCard({ order, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-card border border-border bg-background p-4 cursor-pointer hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-text-secondary">{order.poNumber}</span>
        <Badge variant={getPriorityVariant(order.priority)}>{order.priority}</Badge>
      </div>

      <p className="text-sm font-semibold text-text-primary">{order.productName}</p>
      <p className="text-xs text-text-secondary mt-0.5">{order.customerName}</p>

      <div className="flex items-center gap-1 text-xs text-text-secondary mt-2">
        <DollarSign size={12} />
        Expense: ${order.totalExpense.toLocaleString()}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <ArrowDownToLine size={12} className="text-info" /> {order.bundlesIn} in
          </span>
          <span className="flex items-center gap-1">
            <ArrowUpFromLine size={12} className="text-success" /> {order.bundlesOut} out
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Calendar size={12} />
          {format(new Date(order.deliveryDate), 'MMM d')}
        </div>
      </div>
    </div>
  );
}

ProductionOrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};