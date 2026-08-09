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
 */
export function EmployeePayrollSummary({ employee }) {
  const { data: wages, isLoading } = useWages({ employeeId: employee.id });

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-border bg-background p-6">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['PERIOD', 'GROSS', 'DEDUCTIONS', 'NET', 'PAYROLL STATUS', 'PAYMENT'].map((col) => (
                    <th key={col} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wages.map((w) => (
                  <tr key={w.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm text-text-primary">
                      {format(new Date(w.payPeriodStart), 'MMM d')} – {format(new Date(w.payPeriodEnd), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 text-sm text-text-primary">${w.grossAmount.toLocaleString()}</td>
                    <td className="py-3 text-sm text-danger">-${w.deductions.toLocaleString()}</td>
                    <td className="py-3 text-sm font-semibold text-text-primary">${w.netAmount.toLocaleString()}</td>
                    <td className="py-3"><Badge variant={getPayrollStatusVariant(w.status)}>{w.status}</Badge></td>
                    <td className="py-3"><Badge variant={getWageStatusVariant(w.paymentStatus)}>{w.paymentStatus}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdvancesLoansPanel employeeId={employee.id} showAddButtons={false} />
    </div>
  );
}

EmployeePayrollSummary.propTypes = {
  employee: PropTypes.object.isRequired,
};