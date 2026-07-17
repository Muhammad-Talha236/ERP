import { MoreHorizontal, Building2, Eye, Pencil, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { getEmployeeStatusVariant } from '../utils/employeeStatusVariant';
import { format } from 'date-fns';

/**
 * EmployeeTableRow — a single row in the employees table.
 *
 * Row actions (View/Edit/Delete) are now a DropdownMenu instead of
 * a plain button — each action is wired to a handler passed down
 * from EmployeesPage, which owns the actual modal/dialog state.
 *
 * @param {Object} props
 * @param {Employee} props.employee
 * @param {() => void} props.onView
 * @param {() => void} props.onEdit
 * @param {() => void} props.onDelete
 */
export function EmployeeTableRow({ employee, onView, onEdit, onDelete }) {
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <tr
      onClick={onView}
      className="border-b border-border hover:bg-surface/60 transition-colors cursor-pointer"
    >
      <td className="py-4 px-2">
        <div className="flex items-center gap-3">
          <Avatar name={fullName} imageUrl={employee.profileImage} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{fullName}</p>
            <p className="text-xs text-text-secondary truncate">{employee.email}</p>
          </div>
        </div>
      </td>

      <td className="py-4 px-2">
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Building2 size={14} />
          {employee.department}
        </div>
      </td>

      <td className="py-4 px-2 text-sm text-text-primary">{employee.designation}</td>

      <td className="py-4 px-2 text-sm text-text-secondary">
        {format(new Date(employee.hireDate), 'yyyy-MM-dd')}
      </td>

      <td className="py-4 px-2 text-sm text-text-primary">
        ${employee.baseSalary.toLocaleString()}
      </td>

      <td className="py-4 px-2">
        <Badge variant={getEmployeeStatusVariant(employee.status)}>
          {employee.status}
        </Badge>
      </td>

      <td className="py-4 px-2 text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="icon" aria-label="Row actions">
              <MoreHorizontal size={16} />
            </Button>
          }
          items={[
            { label: 'View', icon: Eye, onClick: onView },
            { label: 'Edit', icon: Pencil, onClick: onEdit },
            { label: 'Delete', icon: Trash2, onClick: onDelete, danger: true },
          ]}
        />
      </td>
    </tr>
  );
}

EmployeeTableRow.propTypes = {
  employee: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};