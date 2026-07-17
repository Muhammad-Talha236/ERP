import PropTypes from 'prop-types';

/**
 * LoadingSkeleton — animated placeholder rows shown while a table's
 * data is loading (React Query's isLoading state).
 *
 * Generic by design: any feature table (Employees, Attendance,
 * Materials, Wages) passes its own `rows` count and reuses this
 * exact component rather than building bespoke loading UI per module.
 *
 * Uses Tailwind's built-in `animate-pulse` utility — no extra
 * animation library needed.
 *
 * @param {Object} props
 * @param {number} [props.rows] - how many skeleton rows to render
 */
export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-card border border-border bg-background p-4 space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-surface shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-surface" />
            <div className="h-2.5 w-1/4 rounded bg-surface" />
          </div>
          <div className="h-3 w-16 rounded bg-surface" />
          <div className="h-3 w-20 rounded bg-surface" />
          <div className="h-6 w-16 rounded-full bg-surface" />
        </div>
      ))}
    </div>
  );
}

LoadingSkeleton.propTypes = {
  rows: PropTypes.number,
};