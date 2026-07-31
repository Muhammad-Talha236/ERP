import PropTypes from 'prop-types';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS = ['Pending', 'In Progress', 'Completed'];

export function ProductionKanbanBoard({ orders, onCardClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          orders={orders.filter((o) => o.status === status)}
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