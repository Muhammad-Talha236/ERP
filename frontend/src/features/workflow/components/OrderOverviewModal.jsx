import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getProductionOrderStatusVariant, getPriorityVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';
import { useOrderWorkflowSteps } from '../hooks/useOrderWorkflowSteps';
import { useBundlesByOrder } from '../hooks/useBundlesByOrder';

/**
 * OrderOverviewModal — quick summary view from the Orders page/Kanban.
 * Detailed workflow management (steps, bundles, movements) now lives
 * on its own dedicated Workflow page — this modal just shows the
 * high-level facts and links there.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {ProductionOrder|null} props.order
 */
export function OrderOverviewModal({ open, onOpenChange, order }) {
  const navigate = useNavigate();
  const { data: steps } = useOrderWorkflowSteps(order?.id);
  const { data: bundles } = useBundlesByOrder(order?.id);

  const totalCost = useMemo(() => {
    if (!steps) return 0;
    return steps.reduce((sum, s) => sum + s.expense + s.wagePerUnit * (order?.quantity ?? 0), 0);
  }, [steps, order]);

  const peopleInvolved = useMemo(() => {
    const names = new Set();
    (steps ?? []).forEach((s) => s.assignedEmployeeName && names.add(s.assignedEmployeeName));
    (bundles ?? []).forEach((b) => b.assignedEmployeeName && names.add(b.assignedEmployeeName));
    return Array.from(names);
  }, [steps, bundles]);

  if (!order) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={order.poNumber}
      description={`${order.customerName} · ${order.productName}`}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => navigate({ to: '/workflow', search: { orderId: order.id } })}>
            Manage Workflow
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant={getProductionOrderStatusVariant(order.status)}>{order.status}</Badge>
          <Badge variant={getPriorityVariant(order.priority)}>{order.priority} priority</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-secondary">Order date</p>
            <p className="text-text-primary font-medium">{format(new Date(order.orderDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-text-secondary">Delivery date</p>
            <p className="text-text-primary font-medium">{format(new Date(order.deliveryDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-text-secondary">Quantity</p>
            <p className="text-text-primary font-medium">{order.quantity.toLocaleString()} units</p>
          </div>
          <div>
            <p className="text-text-secondary">Order value</p>
            <p className="text-text-primary font-medium">${(order.quantity * order.unitPrice).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-text-secondary">Estimated production cost</p>
            <p className="text-text-primary font-medium">${totalCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-text-secondary">People involved</p>
            <p className="text-text-primary font-medium">{peopleInvolved.length > 0 ? peopleInvolved.join(', ') : '—'}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

OrderOverviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  order: PropTypes.object,
};