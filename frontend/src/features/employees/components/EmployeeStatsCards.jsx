import { Users, UserCheck, UserMinus, UserX } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { EMPLOYEE_STATUS } from '@/constants/enums';

/**
 * EmployeeStatsCards — the "Total / Active / On Leave / Inactive"
 * summary row at the top of the Employees page.
 *
 * Counts are DERIVED from the employees array passed in, rather
 * than being separate pieces of state — this guarantees the stats
 * always match what's actually in the table below, with no risk of
 * the two drifting out of sync.
 *
 * @param {Object} props
 * @param {Employee[]} props.employees
 */
export function EmployeeStatsCards({ employees }) {
  const total = employees.length;
  const active = employees.filter((e) => e.status === EMPLOYEE_STATUS.ACTIVE).length;
  const onLeave = employees.filter((e) => e.status === EMPLOYEE_STATUS.ON_LEAVE).length;
  const inactive = employees.filter((e) => e.status === EMPLOYEE_STATUS.INACTIVE).length;

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard label="Total" value={total} icon={Users} accent="primary" />
      <StatCard label="Active" value={active} icon={UserCheck} accent="success" />
      <StatCard label="On Leave" value={onLeave} icon={UserMinus} accent="warning" />
      <StatCard label="Inactive" value={inactive} icon={UserX} accent="danger" />
    </div>
  );
}