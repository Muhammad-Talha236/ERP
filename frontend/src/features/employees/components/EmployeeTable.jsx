import PropTypes from 'prop-types';
import { EmployeeTableRow } from './EmployeeTableRow';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const COLUMNS = ['EMPLOYEE', 'DEPARTMENT', 'POSITION', 'JOINED', 'SALARY', 'STATUS', ''];

/**
 * EmployeeTable — full data table for the Employees page with pagination.
 *
 * @param {Object} props
 * @param {Employee[]} props.employees
 * @param {boolean} props.isLoading
 * @param {(employee: Employee) => void} props.onView
 * @param {(employee: Employee) => void} props.onEdit
 * @param {(employee: Employee) => void} props.onDelete
 */
export function EmployeeTable({ employees, isLoading, onView, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Har page par sirf 5 employees dikhayein ga

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

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(safeEmployees.length / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const currentData = safeEmployees.slice(
    (validPage - 1) * itemsPerPage,
    validPage * itemsPerPage
  );

  return (
    <div className="rounded-card border border-border bg-background p-4 sm:p-6 space-y-4">
      <div className="w-full overflow-x-auto pb-2">
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

      {/* Pagination Controls */}
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