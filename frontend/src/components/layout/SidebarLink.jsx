import { Link } from '@tanstack/react-router';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * SidebarLink — one navigation item in the sidebar.
 *
 * @param {Object} props
 * @param {string} props.to
 * @param {React.ComponentType} props.icon
 * @param {string} props.label
 * @param {boolean} [props.collapsed] - when true, hides the text
 *        label and centers just the icon (title attribute shows
 *        the label on hover as a native browser tooltip)
 */
export function SidebarLink({ to, icon: Icon, label, collapsed }) {
  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-input text-sm font-medium',
        'text-text-secondary hover:bg-surface hover:text-text-primary',
        'transition-colors duration-150',
        collapsed && 'justify-center px-0'
      )}
      activeProps={{
        className: 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
      }}
      activeOptions={{ exact: to === '/' }}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
};