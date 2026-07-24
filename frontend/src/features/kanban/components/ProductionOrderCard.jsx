import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { getPriorityVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';

/**
 * ProductionOrderCard — status-only display card. No click
 * navigation — clicking used to jump to the Workflow page, which
 * was confusing, so this is now purely informational.
 */
export function ProductionOrderCard({ order, totalStages }) {
  const progressPercent = Math.round((order.currentStageOrder / totalStages) * 100);

  return (
    <div className="rounded-card border border-border bg-background p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-text-secondary">{order.poNumber}</span>
        <Badge variant={getPriorityVariant(order.priority)}>{order.priority}</Badge>
      </div>

      <p className="text-sm font-semibold text-text-primary">{order.productName}</p>
      <p className="text-xs text-text-secondary mt-0.5">Qty: {order.quantity.toLocaleString()}</p>

      <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden mt-3">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-text-secondary">{order.customerName}</span>
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
  totalStages: PropTypes.number.isRequired,
};