import { cva } from 'class-variance-authority';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * badgeVariants — color variants for status pills, matching the
 * Status Colors table in the UI/UX design doc:
 * Success (green), Warning (orange/amber), Error (red), Info (blue),
 * plus a neutral gray for default/inactive states.
 */
const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
  {
    variants: {
      variant: {
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/15 text-warning',
        danger: 'bg-danger/15 text-danger',
        info: 'bg-info/15 text-info',
        neutral: 'bg-text-secondary/15 text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

/**
 * Badge — small colored status pill.
 *
 * Deliberately takes a raw `variant` prop (success/warning/danger/
 * info/neutral) rather than a business-specific prop like `status`,
 * so this stays a truly generic UI primitive. Each feature module
 * maps ITS OWN status values to a variant using a small helper
 * (e.g. getEmployeeStatusVariant()) rather than teaching this
 * component about "Active" vs "Present" vs "Paid" — keeping those
 * business rules where they belong, in the feature folder.
 *
 * @param {Object} props
 * @param {'success'|'warning'|'danger'|'info'|'neutral'} [props.variant]
 * @param {React.ReactNode} props.children
 */
export function Badge({ variant, className, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'neutral']),
  className: PropTypes.string,
  children: PropTypes.node,
};