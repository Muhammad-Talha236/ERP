import PropTypes from 'prop-types';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS = ['Pending', 'In Progress', 'Quality Check', 'Completed'];

/**
 * ProductionKanbanBoard — live, READ-ONLY view of where each order
 * stands (PO Flow Step 6).
 *
 * IMPORTANT: cards are no longer draggable between columns. Which
 * column an order appears in is now derived ENTIRELY from actual
 * workflow progress (employees completing their assignments, admin
 * approving Quality Check) — not from manually moving a card. This
 * prevents the board from showing a state that doesn't match what
 * actually happened on the shop floor.
 *
 * @param {Object} props
 * @param {ProductionOrder[]} props.orders
 * @param {(order: ProductionOrder) => void} props.onCardClick
 */
export function ProductionKanbanBoard({ orders, onCardClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          orders={orders.filter((o) => o.status === status)}
          totalStages={6}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}

ProductionKanbanBoard.propTypes = {
  orders: PropTypes.array.isRequired,
  onCardClick: PropTypes.func,
};