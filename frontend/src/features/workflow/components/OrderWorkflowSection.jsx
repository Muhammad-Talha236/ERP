import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OrderWorkflowCard } from './OrderWorkflowCard';
import { fetchOrderWorkflowSteps } from '@/mocks/handlers/productionOrder.mock';

/**
 * OrderWorkflowSection — one group of orders ("Needs Setup" or
 * "In Progress"), filtered by whether ANY of their steps have an
 * assigned employee yet.
 *
 * We fetch each order's steps once here (rather than inside every
 * card) just to determine which section it belongs in — this keeps
 * the filtering logic in one place instead of duplicating it per card.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {ProductionOrder[]} props.orders - all active orders (unfiltered)
 * @param {'unassigned'|'assigned'} props.filterFn
 * @param {string|null} props.expandedOrderId
 * @param {(id: string|null) => void} props.onToggleExpand
 */
export function OrderWorkflowSection({ title, description, orders, filterFn, expandedOrderId, onToggleExpand }) {
  const [stepsByOrder, setStepsByOrder] = useState({});

  // Fetch each order's steps once to classify it into a section.
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      orders.map(async (order) => {
        const steps = await fetchOrderWorkflowSteps(order.id);
        return [order.id, steps];
      })
    ).then((entries) => {
      if (!cancelled) setStepsByOrder(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const steps = stepsByOrder[order.id];
    if (!steps) return false; // not loaded yet
    const hasAnyAssignment = steps.some((s) => s.assignedEmployeeId);
    return filterFn === 'assigned' ? hasAnyAssignment : !hasAnyAssignment;
  });

  if (filteredOrders.length === 0) return null;

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>

      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <OrderWorkflowCard
            key={order.id}
            order={order}
            isExpanded={expandedOrderId === order.id}
            onToggleExpand={() => onToggleExpand(expandedOrderId === order.id ? null : order.id)}
          />
        ))}
      </div>
    </div>
  );
}

OrderWorkflowSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  orders: PropTypes.array.isRequired,
  filterFn: PropTypes.oneOf(['unassigned', 'assigned']).isRequired,
  expandedOrderId: PropTypes.string,
  onToggleExpand: PropTypes.func.isRequired,
};