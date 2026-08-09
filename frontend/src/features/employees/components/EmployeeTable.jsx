import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { MoreHorizontal, Building2, Eye, Pencil, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { getEmployeeStatusVariant } from '../utils/employeeStatusVariant';
import { EmployeeTableRow } from './EmployeeTableRow';

const COLUMNS = ['EMPLOYEE', 'DEPARTMENT', 'POSITION', 'JOINED', 'SALARY', 'STATUS', ''];

/**
 * EmployeeTable — full data table for the Employees page.
 *
 * Renders TWO views and lets Tailwind's breakpoints pick one:
 *  - md and up: the original table (horizontally scrollable as a
 *    fallback if a screen is narrower than the table's min-width).
 *  - below md (phone): a stacked card list instead — a 7-column
 *    table is unreadable on a phone, so each employee becomes one
 *    tappable card with the same info and the same row actions.
 */
export function EmployeeTable({ employees, isLoading, onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  const safeEmployees = employees || [];

  if (safeEmployees.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees found"
        description="Try adjusting your search or filters, or add a new employee."
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(safeEmployees.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const currentData = safeEmployees.slice(
    (validPage - 1) * itemsPerPage,
    validPage * itemsPerPage
  );

  return (
    <div className="rounded-card border border-border bg-background p-4 sm:p-6 space-y-4">
      {/* Tablet/desktop: table */}
      <div className="hidden md:block w-full overflow-x-auto pb-2">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((col, index) => (
                <th
                  key={index}
                  className="text-xs font-semibold text-text-secondary uppercase tracking-wide py-3 px-2 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((employee) => (
              <EmployeeTableRow
                key={employee.id || employee._id}
                employee={employee}
                onView={() => onView(employee)}
                onEdit={() => onEdit(employee)}
                onDelete={() => onDelete(employee)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: card list */}
      <div className="md:hidden space-y-3">
        {currentData.map((employee) => {
          const fullName = `${employee.firstName} ${employee.lastName}`;
          return (
            <div
              key={employee.id || employee._id}
              onClick={() => onView(employee)}
              className="rounded-input border border-border p-3 active:bg-surface/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={fullName} imageUrl={employee.profileImage} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{fullName}</p>
                    <p className="text-xs text-text-secondary truncate">{employee.designation}</p>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  <DropdownMenu
                    trigger={
                      <Button variant="ghost" size="icon" aria-label="Row actions">
                        <MoreHorizontal size={16} />
                      </Button>
                    }
                    items={[
                      { label: 'View', icon: Eye, onClick: () => onView(employee) },
                      { label: 'Edit', icon: Pencil, onClick: () => onEdit(employee) },
                      { label: 'Delete', icon: Trash2, onClick: () => onDelete(employee), danger: true },
                    ]}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary min-w-0">
                  <Building2 size={12} className="shrink-0" />
                  <span className="truncate">{employee.department}</span>
                </div>
                <Badge variant={getEmployeeStatusVariant(employee.status)}>{employee.status}</Badge>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
                <span>Joined {format(new Date(employee.hireDate), 'MMM d, yyyy')}</span>
                <span className="font-semibold text-text-primary">${employee.baseSalary.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination — shared by both views */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <span className="text-xs font-medium text-text-secondary">
            {(validPage - 1) * itemsPerPage + 1}-{Math.min(validPage * itemsPerPage, safeEmployees.length)} of {safeEmployees.length}
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

EmployeeTable.propTypes = {
  employees: PropTypes.array,
  isLoading: PropTypes.bool,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};