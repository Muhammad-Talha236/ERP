import { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { HandCoins, Landmark } from 'lucide-react';
import { format } from 'date-fns';
import { useAdvances } from '../hooks/useAdvances';
import { useLoans } from '../hooks/useLoans';
import { AdvanceFormModal } from './AdvanceFormModal';
import { LoanFormModal } from './LoanFormModal';

/**
 * AdvancesLoansPanel — advances + loans list, with balances.
 * Pass `employeeId` to scope to one employee (used in the Employee
 * profile); omit it to show everyone's (used on the Wages page).
 */
export function AdvancesLoansPanel({ employeeId ,showAddButtons = true}) {
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [isLoanOpen, setIsLoanOpen] = useState(false);

  const filters = employeeId ? { employeeId } : {};
  const { data: advances, isLoading: isAdvancesLoading } = useAdvances(filters);
  const { data: loans, isLoading: isLoansLoading } = useLoans(filters);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-card border border-border bg-background p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HandCoins size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text-primary">Advances</h3>
          </div>
           {showAddButtons && (
            <Button size="sm" variant="outline" onClick={() => setIsAdvanceOpen(true)}>
              + New Advance
            </Button>
          )}
        </div>

        {isAdvancesLoading ? (
          <LoadingSkeleton rows={2} />
        ) : !advances || advances.length === 0 ? (
          <EmptyState icon={HandCoins} title="No advances" description="Recorded advances will appear here." />
        ) : (
          <div className="space-y-3">
            {advances.map((adv) => (
              <div key={adv.id} className="rounded-input border border-border px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    {!employeeId && <p className="text-sm font-semibold text-text-primary">{adv.employeeName}</p>}
                    <p className="text-xs text-text-secondary">{format(new Date(adv.advanceDate), 'MMM d, yyyy')}</p>
                  </div>
                  <Badge variant={adv.status === 'Completed' ? 'success' : adv.status === 'Recovering' ? 'info' : 'warning'}>
                    {adv.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-text-secondary">${adv.amount.toLocaleString()} · {adv.recoveryType}</span>
                  <span className="font-semibold text-text-primary">${adv.remainingBalance.toLocaleString()} remaining</span>
                </div>
                {adv.reason && <p className="text-xs text-text-secondary italic mt-1">{adv.reason}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-card border border-border bg-background p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-primary" />
            <h3 className="text-sm font-semibold text-text-primary">Loans</h3>
          </div>
           {showAddButtons && (
            <Button size="sm" variant="outline" onClick={() => setIsLoanOpen(true)}>
              + New Loan
            </Button>
          )}
        </div>

        {isLoansLoading ? (
          <LoadingSkeleton rows={2} />
        ) : !loans || loans.length === 0 ? (
          <EmptyState icon={Landmark} title="No loans" description="Recorded loans will appear here." />
        ) : (
          <div className="space-y-3">
            {loans.map((loan) => (
              <div key={loan.id} className="rounded-input border border-border px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    {!employeeId && <p className="text-sm font-semibold text-text-primary">{loan.employeeName}</p>}
                    <p className="text-xs text-text-secondary">Started {format(new Date(loan.startDate), 'MMM d, yyyy')}</p>
                  </div>
                  <Badge variant={loan.status === 'Completed' ? 'success' : 'warning'}>{loan.status}</Badge>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-text-secondary">${loan.loanAmount.toLocaleString()} · ${loan.installmentAmount.toLocaleString()}/mo</span>
                  <span className="font-semibold text-text-primary">${loan.remainingBalance.toLocaleString()} remaining</span>
                </div>
                {loan.reason && <p className="text-xs text-text-secondary italic mt-1">{loan.reason}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <AdvanceFormModal open={isAdvanceOpen} onOpenChange={setIsAdvanceOpen} employeeId={employeeId} />
      <LoanFormModal open={isLoanOpen} onOpenChange={setIsLoanOpen} employeeId={employeeId} />
    </div>
  );
}

AdvancesLoansPanel.propTypes = {
  employeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
   showAddButtons: PropTypes.bool,
};