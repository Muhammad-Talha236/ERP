import PropTypes from 'prop-types';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS = ['Pending', 'In Progress', 'Quality Check', 'Completed'];

export function ProductionKanbanBoard({ orders }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUMNS.map((status) => (
        <KanbanColumn key={status} status={status} orders={orders.filter((o) => o.status === status)} totalStages={6} />
      ))}
    </div>
  );
}

ProductionKanbanBoard.propTypes = {
  orders: PropTypes.array.isRequired,
};