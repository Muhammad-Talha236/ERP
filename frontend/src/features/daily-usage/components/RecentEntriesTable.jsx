import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { aggregateDailyUsage } from '../utils/aggregateDailyUsage';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Activity } from 'lucide-react';

const COLUMNS = ['DATE', 'STEEL (KG)', 'ALUMINUM (KG)', 'PLASTIC (KG)', 'TOTAL'];

/**
 * RecentEntriesTable — per-day totals table below the consumption
 * chart, matching the screenshot exactly. Uses the SAME aggregation
 * function as ConsumptionChart, so the chart and table can never
 * show inconsistent numbers for the same underlying data.
 *
 * @param {Object} props
 * @param {DailyUsageEntry[]} props.entries
 * @param {boolean} props.isLoading
 */
export function RecentEntriesTable({ entries, isLoading }) {
  const dailyTotals = useMemo(() => aggregateDailyUsage(entries), [entries]);

  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (dailyTotals.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No usage entries yet"
        description="Recorded material usage will appear here."
      />
    );
  }

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-lg font-bold text-text-primary mb-4">Recent entries</h3>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {COLUMNS.map((col) => (
              <th
                key={col}
                className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dailyTotals.map((day) => (
            <tr key={day.date} className="border-b border-border last:border-0">
              <td className="py-4 text-sm font-semibold text-text-primary">
                {format(new Date(day.date), 'MMM d')}
              </td>
              <td className="py-4 text-sm text-text-secondary">{day.steel}</td>
              <td className="py-4 text-sm text-text-secondary">{day.aluminum}</td>
              <td className="py-4 text-sm text-text-secondary">{day.plastic}</td>
              <td className="py-4 text-sm font-semibold text-text-primary">{day.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

RecentEntriesTable.propTypes = {
  entries: PropTypes.array,
  isLoading: PropTypes.bool,
};