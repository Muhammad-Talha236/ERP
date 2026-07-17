import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

/**
 * SidebarLink — one navigation item in the sidebar.
 *
 * Uses TanStack Router's <Link> (not a plain <a>) so navigation
 * happens client-side without a full page reload, and so we get
 * automatic "active route" detection via activeProps.
 *
 * @param {Object} props
 * @param {string} props.to - route path (e.g. '/employees')
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.label - text shown next to the icon
 */
export function SidebarLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className={cn(
        // Base styles — applied regardless of active state
        'flex items-center gap-3 px-3 py-2 rounded-input text-sm font-medium',
        'text-text-secondary hover:bg-surface hover:text-text-primary',
        'transition-colors duration-150'
      )}
      // activeProps: extra props/classes merged in ONLY when this
      // link's route matches the current URL — this is how the
      // highlighted "Employees" state in your screenshots works.
      activeProps={{
        className: 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
      }}
      // Only the Dashboard ("/") should match exactly — otherwise
      // it would stay "active" on every single route, since "/" is
      // a prefix of every path.
      activeOptions={{ exact: to === '/' }}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}