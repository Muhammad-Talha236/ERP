import { useMemo } from 'react';
import { useMaterials } from '@/features/materials/hooks/useMaterials';
import { useLeaveRequests } from '@/features/attendence/hooks/useLeaveRequests';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';
import { useWagesOverview } from '@/features/wages/hooks/useWagesOverview';
import { isLowStock } from '@/features/materials/utils/materialStockHelpers';
import { isBefore, startOfToday } from 'date-fns';

/**
 * useNotifications — there's no dedicated notifications table in the
 * schema, so instead of a separate endpoint we DERIVE a live
 * notification feed from data every other module already fetches —
 * the same pattern useDashboardStats.js uses for its summary cards.
 * This keeps the bell always in sync with real state (a low-stock
 * material here shows up here too) with zero extra backend work.
 *
 * Each notification gets a stable `id` (so read-state could be
 * tracked later), a `severity` for coloring, and a `to` route for
 * "click to go there".
 */
export function useNotifications() {
  const { data: materials, isLoading: materialsLoading } = useMaterials();
  const { data: leaveRequests, isLoading: leaveLoading } = useLeaveRequests();
  const { data: productionOrders, isLoading: ordersLoading } = useProductionOrders();
  const now = new Date();
  const { data: wagesOverview, isLoading: wagesLoading } = useWagesOverview({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const isLoading = materialsLoading || leaveLoading || ordersLoading || wagesLoading;

  const notifications = useMemo(() => {
    const items = [];
    const today = startOfToday();

    (materials ?? []).filter(isLowStock).forEach((m) => {
      items.push({
        id: `material-${m.id}`,
        severity: 'danger',
        title: `${m.materialName} is low on stock`,
        description: `${m.currentStock} ${m.unit.toLowerCase()}s left (minimum ${m.minimumStock})`,
        to: '/materials',
      });
    });

    (leaveRequests ?? []).filter((r) => r.status === 'Pending').forEach((r) => {
      items.push({
        id: `leave-${r.id}`,
        severity: 'warning',
        title: `${r.employeeName || 'An employee'} requested leave`,
        description: `${r.type} · awaiting approval`,
        to: '/attendance',
      });
    });

    (productionOrders ?? [])
      .filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled' && o.deliveryDate)
      .filter((o) => isBefore(new Date(o.deliveryDate), today))
      .forEach((o) => {
        items.push({
          id: `order-${o.id}`,
          severity: 'danger',
          title: `${o.poNumber} is overdue`,
          description: `${o.productName} · was due ${o.deliveryDate}`,
          to: '/Purchase',
        });
      });

    (wagesOverview ?? [])
      .filter((row) => row.wageId && row.status === 'Approved' && row.netAmount - row.amountPaid > 0)
      .forEach((row) => {
        items.push({
          id: `wage-${row.wageId}`,
          severity: 'info',
          title: `${row.employeeName} has an unpaid wage`,
          description: `$${(row.netAmount - row.amountPaid).toLocaleString()} remaining`,
          to: '/wages',
        });
      });

    return items;
  }, [materials, leaveRequests, productionOrders, wagesOverview]);

  return { notifications, isLoading, count: notifications.length };
}