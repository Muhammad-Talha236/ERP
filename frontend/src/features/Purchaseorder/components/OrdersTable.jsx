import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ShoppingCart } from 'lucide-react';
import { getProductionOrderStatusVariant, getPriorityVariant } from '../utils/productionOrderStatusVariant';
import { useUpdateProductionOrder } from '../hooks/useUpdateProductionOrder';
import { useDeleteProductionOrder } from '../hooks/useDeleteProductionOrder';
import { EditOrderModal } from './EditOrderModal';

const COLUMNS = ['PO #', 'CUSTOMER', 'PRODUCT', 'QTY', 'PRIORITY', 'STATUS', 'DUE', 'ACTIONS'];

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Quality Check', 'Completed'];

export function OrdersTable({ orders, isLoading }) {
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { mutate: updateOrder } = useUpdateProductionOrder();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteProductionOrder();

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

  const handleStatusChange = (order, newStatus) => {
    updateOrder({ id: order.id, status: newStatus });
  };

  const handleDeleteClick = (order) => {
    setDeletingId(order.id);
  };

  const confirmDelete = () => {
    deleteOrder(deletingId, {
      onSettled: () => setDeletingId(null),
    });
  };

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
              <td className="py-4">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e.target.value)}
                  className="text-sm rounded-full px-2 py-1 border border-border bg-background text-text-primary cursor-pointer"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-4 text-sm text-text-secondary">{format(new Date(order.deliveryDate), 'MMM d')}</td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingOrder(order)}
                    className="text-text-secondary hover:text-primary"
                    title="Edit order"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(order)}
                    className="text-text-secondary hover:text-red-600"
                    title="Delete order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit modal */}
      <EditOrderModal
        open={!!editingOrder}
        onOpenChange={(isOpen) => !isOpen && setEditingOrder(null)}
        order={editingOrder}
      />

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-card p-6 max-w-sm w-full space-y-4 border border-border">
            <h3 className="text-lg font-semibold text-text-primary">Delete this order?</h3>
            <p className="text-sm text-text-secondary">
              This action cannot be undone. The production order will be permanently removed.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm rounded-md border border-border text-text-primary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

OrdersTable.propTypes = {
  orders: PropTypes.array,
  isLoading: PropTypes.bool,
};