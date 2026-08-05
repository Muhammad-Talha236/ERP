import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import { ArrowDownToLine, ArrowUpFromLine, Layers } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { getProductionOrderStatusVariant } from '@/features/Purchaseorder/utils/productionOrderStatusVariant';

export function OrderSummaryModal({ open, onOpenChange, order }) {
  if (!order) return null;

  // ---------------------------------------------------------
  // Safe values
  // ---------------------------------------------------------
  const bundles = Array.isArray(order.bundles) ? order.bundles : [];

  const quantity = Number(order.quantity ?? 0);
  const totalExpense = Number(order.totalExpense ?? 0);
  const bundlesIn = Number(order.bundlesIn ?? 0);
  const bundlesOut = Number(order.bundlesOut ?? 0);

  // ---------------------------------------------------------
  // Safe date formatter
  // ---------------------------------------------------------
  const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (!isValid(parsedDate)) {
      return '—';
    }

    return format(parsedDate, 'MMM d, yyyy');
  };

  // ---------------------------------------------------------
  // Build Stage Breakdown from order.bundles
  //
  // currentStageName tells us which stage the bundle
  // currently belongs to.
  //
  // Matches the same rule used everywhere else in the app
  // (KanbanPage.jsx bundlesIn/bundlesOut, original bundle
  // badge logic):
  //   Out = status === 'Completed'
  //   In  = anything else (Not Started + In Progress)
  // ---------------------------------------------------------
  const stageBreakdown = Object.values(
    bundles.reduce((acc, bundle) => {
      const stageName = bundle.currentStageName || 'Unknown Stage';

      if (!acc[stageName]) {
        acc[stageName] = {
          stageName,
          stageOrder: bundle.currentStageOrder ?? 999,
          inBundles: [],
          outBundles: [],
        };
      }

      if (bundle.status === 'Completed') {
        acc[stageName].outBundles.push(bundle);
      } else {
        acc[stageName].inBundles.push(bundle);
      }

      return acc;
    }, {})
  ).sort((a, b) => a.stageOrder - b.stageOrder);

  return (
    <Modal
  open={open}
  onOpenChange={onOpenChange}
  title={
    <div className="flex items-center justify-between gap-3 w-full">
      <span>{order.poNumber ?? '—'}</span>

      <Badge variant={getProductionOrderStatusVariant(order.status)}>
        {order.status ?? 'Unknown'}
      </Badge>
    </div>
  }
  description={`${order.customerName ?? '—'} · ${order.productName ?? '—'}`}
  size="lg"
>
      <div className="space-y-5">

      

        {/* -------------------------------------------------
            Basic Information
        ------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-4 text-sm">

          {/* Quantity */}
          <div>
            <p className="text-text-secondary">
              Quantity
            </p>

            <p className="text-text-primary font-medium">
              {quantity.toLocaleString()} units
            </p>
          </div>

          {/* Delivery Date */}
          <div>
            <p className="text-text-secondary">
              Delivery date
            </p>

            <p className="text-text-primary font-medium">
              {formatDate(order.deliveryDate)}
            </p>
          </div>

          {/* Received Date */}
          <div>
            <p className="text-text-secondary">
              Date received
            </p>

            <p className="text-text-primary font-medium">
              {formatDate(order.receivedDate)}
            </p>
          </div>

          {/* Completed Date */}
          <div>
            <p className="text-text-secondary">
              Date completed
            </p>

            <p className="text-text-primary font-medium">
              {formatDate(order.completedDate)}
            </p>
          </div>

          {/* Total Expense */}
          <div>
            <p className="text-text-secondary">
              Total expense
            </p>

            <p className="text-text-primary font-medium">
              ${totalExpense.toLocaleString()}
            </p>
          </div>

          {/* Bundles In / Out */}
          <div>
            <p className="text-text-secondary">
              Bundles In / Out
            </p>

            <p className="text-text-primary font-medium">
              {bundlesIn} in · {bundlesOut} out
            </p>
          </div>

        </div>

        {/* -------------------------------------------------
            Stage Breakdown
        ------------------------------------------------- */}
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3">
            Stage Breakdown
          </p>

          {stageBreakdown.length === 0 ? (
            <div className="rounded-card border border-border bg-surface/30 p-4">
              <p className="text-xs text-text-secondary italic">
                No stage breakdown available.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stageBreakdown.map((stage) => {
                const total = stage.inBundles.length + stage.outBundles.length;
                const outPercent = total > 0 ? Math.round((stage.outBundles.length / total) * 100) : 0;

                return (
                  <div
                    key={stage.stageName}
                    className="rounded-card border border-border bg-background overflow-hidden"
                  >
                    {/* Stage header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/40">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-input bg-primary/15 text-primary flex items-center justify-center shrink-0">
                          <Layers size={14} />
                        </div>
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {stage.stageName}
                        </p>
                      </div>
                     
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 w-full bg-surface">
                      <div
                        className="h-full bg-success transition-all"
                        style={{ width: `${outPercent}%` }}
                      />
                    </div>

                    {/* In / Out columns */}
                    <div className="grid grid-cols-2 divide-x divide-border">
                      {/* IN */}
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 text-xs text-info font-medium mb-2">
                          <ArrowDownToLine size={12} />
                          In ({stage.inBundles.length})
                        </div>

                        {stage.inBundles.length === 0 ? (
                          <p className="text-xs text-text-secondary italic">None</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {stage.inBundles.map((bundle) => (
                              <span
                                key={bundle.id}
                                className="text-xs font-medium bg-info/10 text-info border border-info/20 rounded-full px-2.5 py-1"
                              >
                                {bundle.bundleNumber}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* OUT */}
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 text-xs text-success font-medium mb-2">
                          <ArrowUpFromLine size={12} />
                          Out ({stage.outBundles.length})
                        </div>

                        {stage.outBundles.length === 0 ? (
                          <p className="text-xs text-text-secondary italic">None</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {stage.outBundles.map((bundle) => (
                              <span
                                key={bundle.id}
                                className="text-xs font-medium bg-success/10 text-success border border-success/20 rounded-full px-2.5 py-1"
                              >
                                {bundle.bundleNumber}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        

      </div>
    </Modal>
  );
}

OrderSummaryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  order: PropTypes.object,
};