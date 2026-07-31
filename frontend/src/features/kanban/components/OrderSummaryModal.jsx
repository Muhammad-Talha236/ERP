import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';

/**
 * OrderSummaryModal — read-only order + bundle overview shown when
 * a Kanban card is clicked. No editing here — for that, go to the
 * Workflow page (Bundles tab, "Assign Employees").
 */
export function OrderSummaryModal({ open, onOpenChange, order, bundles }) {
  if (!order) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={order.poNumber}
      description={`${order.customerName} · ${order.productName}`}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant={getProductionOrderStatusVariant(order.status)}>{order.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-secondary">Quantity</p>
            <p className="text-text-primary font-medium">{order.quantity.toLocaleString()} units</p>
          </div>
          <div>
            <p className="text-text-secondary">Delivery date</p>
            <p className="text-text-primary font-medium">{format(new Date(order.deliveryDate), 'MMM d, yyyy')}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">
            Bundles ({order.completedBundles}/{order.totalBundles} complete)
          </p>
          <div className="space-y-2">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="flex items-center justify-between rounded-input border border-border px-3 py-2">
                <div>
                  <p className="text-sm text-text-primary">{bundle.bundleNumber}</p>
                  <p className="text-xs text-text-secondary">Qty {bundle.quantity} · {bundle.currentStageName}</p>
                </div>
                <Badge variant={bundle.status === 'Completed' ? 'success' : bundle.status === 'In Progress' ? 'info' : 'neutral'}>
                  {bundle.status}
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
  bundles: PropTypes.array,
};