import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

/**
 * Avatar — circular initials (or photo) badge representing a person.
 *
 * Falls back to initials derived from a name when no image URL is
 * provided — matches every avatar in your screenshots (PM, MC, AR...),
 * since profileImage is null for all current mock employees.
 *
 * Generic by design: any module needing a "person badge" (Attendance
 * check-in list, Wages table, a future Customers module) reuses this
 * exact component rather than reimplementing initials logic.
 *
 * @param {Object} props
 * @param {string} props.name - full name, used to derive initials
 * @param {string} [props.imageUrl] - photo URL, takes priority if present
 * @param {'sm'|'md'|'lg'} [props.size]
 */
export function Avatar({ name, imageUrl, size = 'md', className }) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full shrink-0 font-semibold overflow-hidden',
        'bg-primary/15 text-primary',
        sizeStyles[size],
        className
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

/**
 * getInitials — "Priya Menon" -> "PM". Takes the first letter of
 * the first two words; falls back gracefully for single-word names.
 */
function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
};

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};