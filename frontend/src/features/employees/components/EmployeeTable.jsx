import PropTypes from 'prop-types';
import { EmployeeTableRow } from './EmployeeTableRow';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Users } from 'lucide-react';

const COLUMNS = ['EMPLOYEE', 'DEPARTMENT', 'POSITION', 'JOINED', 'SALARY', 'STATUS', ''];

/**
 * EmployeeTable — full data table for the Employees page.
 *
 * @param {Object} props
 * @param {Employee[]} props.employees
 * @param {boolean} props.isLoading
 * @param {(employee: Employee) => void} props.onView
 * @param {(employee: Employee) => void} props.onEdit
 * @param {(employee: Employee) => void} props.onDelete
 */
export function EmployeeTable({ employees, isLoading, onView, onEdit, onDelete }) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!employees || employees.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No employees found"
        description="Try adjusting your search or filters, or add a new employee."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-background">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3 px-2"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeTableRow
              key={employee.id}
              employee={employee}
              onView={() => onView(employee)}
              onEdit={() => onEdit(employee)}
              onDelete={() => onDelete(employee)}
            />
          ))}
        </tbody>
      </table>
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