import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Wallet } from 'lucide-react';
import { useWages } from '@/features/wages/hooks/useWages';
import { AdvancesLoansPanel } from '@/features/wages/components/AdvancesLoansPanel';
import { getWageStatusVariant, getPayrollStatusVariant } from '@/features/wages/utils/wageStatusVariant';

/**
 * EmployeePayrollSummary — payroll tab on the Employee profile:
 * basic pay, full payroll history, and this employee's own
 * advances/loans, without touching anything on the Employees page
 * or Employee model itself.
 *
 * FIX: the payroll history table previously had `overflow-x-auto`
 * on its wrapper but no `min-width` on the <table> itself, and no
 * `whitespace-nowrap` on cells. That combination means the browser
 * never actually triggers horizontal scrolling on narrow screens —
 * instead it just squeezes all 6 columns into the available width,
 * which is what caused the overlapping/garbled header text and
 * wrapped cells in the screenshot ("PERIODGROSS DEDUCTIONSNET").
 *
 * Now: tablet/desktop keeps the real table (with min-w so it
 * scrolls horizontally instead of squishing), and phones get a
 * stacked card list instead — matching the same responsive pattern
 * already used elsewhere in the app (EmployeeTable.jsx,
 * LeaveRequestsTable.jsx, CheckInOutList.jsx).
 */
export function EmployeePayrollSummary({ employee }) {
  const { data: wages, isLoading } = useWages({ employeeId: employee.id });

  const safeFormatPeriod = (w) =>
    `${format(new Date(w.payPeriodStart), 'MMM d')} – ${format(new Date(w.payPeriodEnd), 'MMM d, yyyy')}`;

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-border bg-background p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Payroll History</h3>

        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : !wages || wages.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No payroll records yet"
            description="Generated payroll for this employee will appear here."
          />
        ) : (
          <>
            {/* Tablet/desktop: real table, scrolls horizontally instead of squishing */}
            <div className="hidden md:block w-full overflow-x-auto pb-2">
              <table className="w-full min-w-[720px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    {['PERIOD', 'GROSS', 'DEDUCTIONS', 'NET', 'PAYROLL STATUS', 'PAYMENT'].map((col) => (
                      <th
                        key={col}
                        className="text-xs font-semibold text-text-secondary uppercase tracking-wide py-3 px-2 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wages.map((w) => (
                    <tr key={w.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-2 text-sm text-text-primary whitespace-nowrap">
                        {safeFormatPeriod(w)}
                      </td>
                      <td className="py-3 px-2 text-sm text-text-primary whitespace-nowrap">
                        ${w.grossAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm text-danger whitespace-nowrap">
                        -${w.deductions.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm font-semibold text-text-primary whitespace-nowrap">
                        ${w.netAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <Badge variant={getPayrollStatusVariant(w.status)}>{w.status}</Badge>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <Badge variant={getWageStatusVariant(w.paymentStatus)}>{w.paymentStatus}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phone: stacked cards instead of a cramped 6-column table */}
            <div className="md:hidden space-y-3">
              {wages.map((w) => (
                <div key={w.id} className="rounded-input border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text-primary">{safeFormatPeriod(w)}</p>
                    <p className="text-sm font-bold text-text-primary shrink-0">
                      ${w.netAmount.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between gap-3 mt-2 text-xs text-text-secondary">
                    <span>
                      Gross: <span className="text-text-primary font-medium">${w.grossAmount.toLocaleString()}</span>
                    </span>
                    <span className="text-danger">Deduction: -${w.deductions.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60">
                    <Badge variant={getPayrollStatusVariant(w.status)}>{w.status}</Badge>
                    <Badge variant={getWageStatusVariant(w.paymentStatus)}>{w.paymentStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AdvancesLoansPanel employeeId={employee.id} showAddButtons={false} />
    </div>
  );
}

EmployeePayrollSummary.propTypes = {
  employee: PropTypes.object.isRequired,
};