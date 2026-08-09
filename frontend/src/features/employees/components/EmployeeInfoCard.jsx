import PropTypes from 'prop-types';
import { format } from 'date-fns';

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
    <div className="rounded-card border border-border bg-background p-4 sm:p-6 space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-text-primary mb-3">{section.title}</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div key={field.label} className="min-w-0">
                <dt className="text-xs text-text-secondary">{field.label}</dt>
                <dd className="text-sm text-text-primary mt-0.5 truncate">{field.value}</dd>
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