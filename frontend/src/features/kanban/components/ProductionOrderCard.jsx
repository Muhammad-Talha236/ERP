import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { getPriorityVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';

/**
 * ProductionOrderCard — back to an ORDER card, showing a
 * "X/Y bundles complete" rollup instead of full bundle detail.
 * Clicking opens OrderSummaryModal (via the parent's onClick).
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

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <span className="text-xs text-text-secondary">
          {order.completedBundles}/{order.totalBundles} bundles complete
        </span>
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