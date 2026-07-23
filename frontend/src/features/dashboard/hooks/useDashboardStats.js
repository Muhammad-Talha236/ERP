import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { useAttendance } from '@/features/attendence/hooks/useAttendance';
import { useMaterials } from '@/features/materials/hooks/useMaterials';
import { useWages } from '@/features/wages/hooks/useWages';
import { useProductionOrders } from '@/features/Purchaseorder/hooks/useProductionOrders';
import { format } from 'date-fns';

/**
 * useDashboardStats — composes data from EVERY module's existing
 * hooks into the 6 summary metrics shown on the Dashboard.
 *
 * This is intentionally NOT a separate mock/API endpoint — it's a
 * derived aggregation of data each module already fetches on its
 * own page. This avoids duplicating data in two places (a dedicated
 * "dashboard stats" endpoint AND each module's own data) and means
 * the Dashboard is automatically consistent with what each module
 * page shows, since they share the same source.
 */
export function useDashboardStats() {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: attendanceRecords, isLoading: attendanceLoading } = useAttendance({
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const { data: materials, isLoading: materialsLoading } = useMaterials();
  const { data: wages, isLoading: wagesLoading } = useWages();
  const { data: productionOrders, isLoading: productionLoading } = useProductionOrders();

  const isLoading =
    employeesLoading || attendanceLoading || materialsLoading || wagesLoading || productionLoading;

  const totalEmployees = employees?.length ?? 0;
  const todayAttendance = (attendanceRecords ?? []).filter((r) => r.status === 'Present').length;
  const activeProduction = (productionOrders ?? []).filter((o) => o.status === 'In Progress').length;
  const materialStock = (materials ?? []).reduce((sum, m) => sum + m.currentStock, 0);
  const pendingPayments = (wages ?? []).reduce((sum, w) => sum + (w.netAmount - w.amountPaid), 0);
  const monthlyRevenue = (productionOrders ?? []).reduce((sum, o) => sum + o.quantity * o.unitPrice, 0);

  return {
    isLoading,
    totalEmployees,
    todayAttendance,
    activeProduction,
    materialStock,
    pendingPayments,
    monthlyRevenue,
    employees: employees ?? [],
    productionOrders: productionOrders ?? [],
    materials: materials ?? [],
  };
}