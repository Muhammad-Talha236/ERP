import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { aggregateDailyUsage } from '../utils/aggregateDailyUsage';

/**
 * CATEGORY_COLORS — bar colors per material category, matching the
 * screenshot exactly: blue (steel), orange (aluminum), green (plastic).
 */
const CATEGORY_COLORS = {
  steel: '#3B82F6',
  aluminum: '#F59E0B',
  plastic: '#22C55E',
};

/**
 * CustomTooltip — recharts lets us fully replace the default tooltip.
 * Matches the screenshot's dark card style: date header, then a
 * colored line per category with its value.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-input border border-border bg-background px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-text-primary mb-2">
        {format(new Date(label), 'MMM d')}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.dataKey} : {entry.value}
        </p>
      ))}
    </div>
  );
}

/**
 * ConsumptionChart — grouped bar chart of daily material consumption
 * by category (steel/aluminum/plastic), matching the design screenshot.
 *
 * @param {Object} props
 * @param {DailyUsageEntry[]} props.entries - raw usage entries;
 *        aggregation into per-day totals happens internally via
 *        aggregateDailyUsage, so the chart owns its own data shaping.
 */
export function ConsumptionChart({ entries }) {
  const chartData = useMemo(() => aggregateDailyUsage(entries), [entries]);

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-lg font-bold text-text-primary">Weekly material consumption</h3>
      <p className="text-sm text-text-secondary mb-6">By primary material category (kg)</p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'MMM d')}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface)' }} />
          <Legend
            wrapperStyle={{ fontSize: 13, color: 'var(--color-text-secondary)' }}
            iconType="square"
          />
          <Bar dataKey="steel" fill={CATEGORY_COLORS.steel} radius={[4, 4, 0, 0]} />
          <Bar dataKey="aluminum" fill={CATEGORY_COLORS.aluminum} radius={[4, 4, 0, 0]} />
          <Bar dataKey="plastic" fill={CATEGORY_COLORS.plastic} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

ConsumptionChart.propTypes = {
  entries: PropTypes.array.isRequired,
};