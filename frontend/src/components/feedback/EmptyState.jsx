import PropTypes from 'prop-types';

/**
 * EmptyState — shown when a table/list has zero results, either
 * because no data exists yet or because filters excluded everything.
 *
 * Matches the UI/UX doc's Empty State Rules: friendly icon, short
 * explanation, optional primary action. Reused across every module
 * (Employees, Attendance, Materials, Daily Usage, Wages).
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action] - optional button/link
 */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-card border border-border bg-background py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mb-4">
        <Icon size={24} className="text-text-secondary" />
      </div>
      <p className="text-base font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="text-sm text-text-secondary mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};