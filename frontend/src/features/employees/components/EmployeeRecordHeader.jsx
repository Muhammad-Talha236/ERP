import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import PropTypes from 'prop-types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { getEmployeeStatusVariant } from '../utils/employeeStatusVariant';

/**
 * EmployeeRecordHeader — top banner of the Employee Record page:
 * back link, large avatar, name, role, department, and status.
 *
 * @param {Object} props
 * @param {Employee} props.employee
 */
export function EmployeeRecordHeader({ employee }) {
  const fullName = `${employee.firstName} ${employee.lastName}`;

  return (
    <div className="space-y-4">
      <Link
        to="/employees"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Employees
      </Link>

      <div className="flex items-center gap-4 rounded-card border border-border bg-background p-6">
        <Avatar name={fullName} imageUrl={employee.profileImage} size="lg" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-text-primary">{fullName}</h2>
            <Badge variant={getEmployeeStatusVariant(employee.status)}>
              {employee.status}
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            {employee.designation} · {employee.department}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            Employee Code: {employee.employeeCode}
          </p>
        </div>
      </div>
    </div>
  );
}

EmployeeRecordHeader.propTypes = {
  employee: PropTypes.object.isRequired,
};