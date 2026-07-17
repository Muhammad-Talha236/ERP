import { AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/Button';

/**
 * ErrorState — shown when a query fails (React Query's isError).
 *
 * Distinct from EmptyState: this means something went WRONG
 * (network failure, server error) rather than "there's just no
 * data yet." Provides a retry button wired directly to React
 * Query's refetch() function, passed in by the calling page.
 *
 * @param {Object} props
 * @param {string} [props.message]
 * @param {() => void} [props.onRetry] - typically a query's refetch()
 */
export function ErrorState({ message = 'Something went wrong while loading data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-card border border-border bg-background py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-danger/15 flex items-center justify-center mb-4">
        <AlertTriangle size={24} className="text-danger" />
      </div>
      <p className="text-base font-semibold text-text-primary">Unable to load data</p>
      <p className="text-sm text-text-secondary mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-5">
          Try again
        </Button>
      )}
    </div>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};