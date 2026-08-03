import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';

/**
 * OrderSummaryModal — "full detail view on click" per the
 * requirement. Now shows received/completed dates, total expense,
 * and a Bundles In/Out breakdown at the top, plus the per-bundle
 * list (each bundle's own quantity/current stage IS the granular
 * "in/out" detail — which bundle is still moving through the
 * pipeline vs already finished).
 */
export function OrderSummaryModal({ open, onOpenChange, order }) {
  if (!order) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={order.poNumber}
      description={`${order.customerName} · ${order.productName}`}
    >
      <div className="space-y-5">
        <Badge variant={getProductionOrderStatusVariant(order.status)}>{order.status}</Badge>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-secondary">Quantity</p>
            <p className="text-text-primary font-medium">{order.quantity.toLocaleString()} units</p>
          </div>
          <div>
            <p className="text-text-secondary">Delivery date</p>
            <p className="text-text-primary font-medium">{format(new Date(order.deliveryDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-text-secondary">Date received</p>
            <p className="text-text-primary font-medium">
              {order.receivedDate ? format(new Date(order.receivedDate), 'MMM d, yyyy') : '—'}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Date completed</p>
            <p className="text-text-primary font-medium">
              {order.completedDate ? format(new Date(order.completedDate), 'MMM d, yyyy') : '—'}
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Total expense</p>
            <p className="text-text-primary font-medium">${order.totalExpense.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-text-secondary">Bundles In / Out</p>
            <p className="text-text-primary font-medium">{order.bundlesIn} in · {order.bundlesOut} out</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            Bundle Breakdown
          </p>
          <div className="space-y-2">
            {order.bundles.map((bundle) => (
              <div key={bundle.id} className="flex items-center justify-between rounded-input border border-border px-3 py-2">
                <div>
                  <p className="text-sm text-text-primary">{bundle.bundleNumber}</p>
                  <p className="text-xs text-text-secondary">Qty {bundle.quantity} · {bundle.currentStageName}</p>
                </div>
                <Badge variant={bundle.status === 'Completed' ? 'success' : bundle.status === 'In Progress' ? 'info' : 'neutral'}>
                  {bundle.status === 'Completed' ? 'Out' : 'In'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-text-secondary">
          To assign employees or manage stages, go to the Workflow page.
        </p>
      </div>
    </Modal>
  );
}

OrderSummaryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  order: PropTypes.object,
};