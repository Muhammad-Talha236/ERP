import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPOStatusVariant, getPOPaymentVariant } from '../utils/stockOrderStatusVariant';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ShoppingCart } from 'lucide-react';

const COLUMNS = ['PO #', 'SUPPLIER', 'ITEMS', 'TOTAL', 'STATUS', 'PAYMENT', 'CREATED', ''];
const ITEMS_PER_PAGE = 5;

/**
 * POTable — full purchase orders table.
 *
 * FIX: previously this rendered every purchase order in one long
 * horizontally-scrolling table with no pagination, which on phone
 * meant swiping sideways through 8 columns just to find "View", and
 * on any screen meant an ever-growing list with no way to page
 * through it. Now: 5 orders per page (desktop AND mobile, per
 * request), a real table for tablet/desktop, and a stacked card
 * list for phone — same responsive pattern used across the rest of
 * the app (EmployeeTable.jsx, LeaveRequestsTable.jsx). All existing
 * behavior (onViewClick, status/payment badges) is unchanged.
 *
 * @param {Object} props
 * @param {PurchaseOrder[]} props.purchaseOrders
 * @param {boolean} props.isLoading
 * @param {(po: PurchaseOrder) => void} props.onViewClick
 */
export function POTable({ purchaseOrders, isLoading, onViewClick }) {
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!purchaseOrders || purchaseOrders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="No purchase orders found"
        description="Create your first purchase order to start ordering materials."
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(purchaseOrders.length / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const currentData = purchaseOrders.slice(
    (validPage - 1) * ITEMS_PER_PAGE,
    validPage * ITEMS_PER_PAGE
  );

  const itemCount = (po) => po.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="rounded-card border border-border bg-background p-4 sm:p-6 space-y-4">
      {/* Tablet/desktop: full table */}
      <div className="hidden md:block w-full overflow-x-auto pb-2">
        <table className="w-full min-w-[720px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col) => (
                <th key={col} className="text-xs font-semibold text-text-secondary uppercase tracking-wide py-3 px-2 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((po) => (
              <tr key={po.id} className="border-b border-border last:border-0">
                <td className="py-4 px-2 text-sm font-semibold text-text-primary whitespace-nowrap">{po.poNumber}</td>
                <td className="py-4 px-2 text-sm text-text-primary whitespace-nowrap">{po.supplierName}</td>
                <td className="py-4 px-2 text-sm text-text-secondary whitespace-nowrap">{itemCount(po)}</td>
                <td className="py-4 px-2 text-sm font-semibold text-text-primary whitespace-nowrap">
                  ${po.totalAmount.toLocaleString()}
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <Badge variant={getPOStatusVariant(po.status)}>{po.status}</Badge>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <Badge variant={getPOPaymentVariant(po.paymentStatus)}>{po.paymentStatus}</Badge>
                </td>
                <td className="py-4 px-2 text-sm text-text-secondary whitespace-nowrap">
                  {format(new Date(po.createdDate), 'MMM d')}
                </td>
                <td className="py-4 px-2 text-right whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => onViewClick(po)}>
                    <Eye size={14} /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: stacked cards */}
      <div className="md:hidden space-y-3">
        {currentData.map((po) => (
          <div key={po.id} className="rounded-input border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{po.poNumber}</p>
                <p className="text-xs text-text-secondary truncate">{po.supplierName}</p>
              </div>
                <div className="flex items-center gap-2 mt-2">
              <Badge variant={getPOStatusVariant(po.status)}>{po.status}</Badge>
              <Badge variant={getPOPaymentVariant(po.paymentStatus)}>{po.paymentStatus}</Badge>
            </div>
            </div>

              <p className="text-sm font-bold text-text-primary shrink-0 mt-2">${po.totalAmount.toLocaleString()}</p>
          

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
              <span className="text-xs text-text-secondary">
                {itemCount(po)} items · {format(new Date(po.createdDate), 'MMM d')}
              </span>
              <Button variant="outline" size="sm" onClick={() => onViewClick(po)}>
                <Eye size={14} /> View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination — 5 per page, same on desktop and mobile */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xs font-medium text-text-secondary">
            {(validPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(validPage * ITEMS_PER_PAGE, purchaseOrders.length)} of {purchaseOrders.length}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage === 1}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-xs font-bold text-text-primary w-8 text-center">
              {validPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage === totalPages}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

POTable.propTypes = {
  purchaseOrders: PropTypes.array,
  isLoading: PropTypes.bool,
  onViewClick: PropTypes.func,
};