import PropTypes from 'prop-types';
import { format } from 'date-fns';

/**
 * EmployeeInfoCard — structured details grid on the Employee Record
 * page: Contact Info, Employment Info, Compensation.
 *
 * Field groups are computed from the employee object here (rather
 * than passed in fully generic form) since this component is
 * intentionally specific to the Employee entity — unlike Badge or
 * StatCard, this one is allowed to know about "salary" and "hire
 * date" because it lives inside the employees feature folder.
 *
 * @param {Object} props
 * @param {Employee} props.employee
 */
export function EmployeeInfoCard({ employee }) {
  const sections = [
    {
      title: 'Contact Information',
      fields: [
        { label: 'Email', value: employee.email || '—' },
        { label: 'Phone', value: employee.phone },
        { label: 'Gender', value: employee.gender },
      ],
    },
    {
      title: 'Employment Information',
      fields: [
        { label: 'Department', value: employee.department },
        { label: 'Designation', value: employee.designation },
        { label: 'Hire Date', value: format(new Date(employee.hireDate), 'MMMM d, yyyy') },
      ],
    },
    {
      title: 'Compensation',
      fields: [
        { label: 'Salary Type', value: employee.salaryType },
        {
          label: 'Base Salary',
          value: `$${employee.baseSalary.toLocaleString()}`,
        },
      ],
    },
  ];

  return (
    <div className="rounded-card border border-border bg-background p-6 space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-text-primary mb-3">{section.title}</h3>
          <dl className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs text-text-secondary">{field.label}</dt>
                <dd className="text-sm text-text-primary mt-0.5">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

EmployeeInfoCard.propTypes = {
  employee: PropTypes.object.isRequired,
};