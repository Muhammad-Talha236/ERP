import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import { ProductionOrderCard } from './ProductionOrderCard';

const STATUS_DOT_COLOR = {
  Pending: 'bg-text-secondary',
  'In Progress': 'bg-info',
  'Quality Check': 'bg-warning',
  Completed: 'bg-success',
};

export function KanbanColumn({ status, orders, totalStages }) {
  return (
    <div className="flex-1 min-w-[280px] rounded-card border border-border bg-background/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className={cn('w-2 h-2 rounded-full', STATUS_DOT_COLOR[status])} />
        <h3 className="text-sm font-bold text-text-primary">{status}</h3>
        <span className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded-full">{orders.length}</span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <ProductionOrderCard key={order.id} order={order} totalStages={totalStages} />
        ))}
      </div>
    </div>
  );
}

KanbanColumn.propTypes = {
  status: PropTypes.string.isRequired,
  orders: PropTypes.array.isRequired,
  totalStages: PropTypes.number.isRequired,
};