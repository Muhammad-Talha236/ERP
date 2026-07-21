import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';

/**
 * OrderMovementLog — chronological log of every bundle movement
 * across the whole order (PO Flow Step 7: "bundle movements" breakdown).
 *
 * @param {Object} props
 * @param {BundleStageMovement[]} props.movements
 * @param {boolean} props.isLoading
 */
export function OrderMovementLog({ movements, isLoading }) {
  if (isLoading) return <LoadingSkeleton rows={3} />;

  if (!movements || movements.length === 0) {
    return <p className="text-sm text-text-secondary">No movements logged yet.</p>;
  }

  return (
    <div className="space-y-3">
      {movements.map((m) => (
        <div key={m.id} className="flex items-start justify-between rounded-input border border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {m.stageName} · {m.loggedByEmployeeName}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Received {m.quantityReceived} · Output {m.quantityOutput}
              {m.quantityWastage > 0 && ` · Wastage ${m.quantityWastage}`}
            </p>
            {m.remarks && <p className="text-xs text-text-secondary italic mt-0.5">{m.remarks}</p>}
          </div>
          <p className="text-xs text-text-secondary whitespace-nowrap">{format(new Date(m.date), 'MMM d')}</p>
        </div>
      ))}
    </div>
  );
}

OrderMovementLog.propTypes = {
  movements: PropTypes.array,
  isLoading: PropTypes.bool,
};