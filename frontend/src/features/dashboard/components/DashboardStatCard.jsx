import PropTypes from 'prop-types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * DashboardStatCard — richer stat card with an embedded sparkline
 * trend line, used ONLY on the Dashboard (the generic StatCard used
 * elsewhere doesn't have room/need for this).
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {React.ComponentType} props.icon
 * @param {number[]} props.trendData - sparkline values
 * @param {number} props.changePercent - e.g. 4.2 or -2.1
 * @param {string} props.lineColor - hex color for the sparkline
 * @param {string} props.iconAccent - Tailwind classes for icon bg/text
 */
export function DashboardStatCard({ label, value, icon: Icon, trendData, changePercent, lineColor, iconAccent }) {
  const isPositive = changePercent >= 0;
  const chartData = trendData.map((v, i) => ({ index: i, value: v }));

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
        <div className={cn('w-9 h-9 rounded-input flex items-center justify-center shrink-0', iconAccent)}>
          <Icon size={16} />
        </div>
      </div>

      <p className="text-3xl font-bold text-text-primary mt-3">{value}</p>

      <div className={cn('flex items-center gap-1 text-sm mt-1', isPositive ? 'text-success' : 'text-danger')}>
        {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        {Math.abs(changePercent)}% <span className="text-text-secondary">vs last week</span>
      </div>

      <div className="h-12 mt-3 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

DashboardStatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trendData: PropTypes.arrayOf(PropTypes.number).isRequired,
  changePercent: PropTypes.number.isRequired,
  lineColor: PropTypes.string.isRequired,
  iconAccent: PropTypes.string.isRequired,
};