import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * CustomTooltip — matches the screenshot's dark card style exactly:
 * month header, then colored revenue/expenses lines.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-input border border-border bg-background px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-text-primary mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.dataKey} : {entry.value}
        </p>
      ))}
    </div>
  );
}

/**
 * RevenueExpenseChart — area chart of monthly revenue vs expenses,
 * matching the design screenshot's exact colors and fill style.
 *
 * @param {Object} props
 * @param {MonthlyFinancial[]} props.data
 */
export function RevenueExpenseChart({ data }) {
  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Revenue vs Expenses</h3>
          <p className="text-sm text-text-secondary">Last 6 months ($K)</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 13, color: 'var(--color-text-secondary)' }} />

          <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revenueGradient)" />
          <Area type="monotone" dataKey="expenses" stroke="#F59E0B" strokeWidth={2} fill="url(#expensesGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

RevenueExpenseChart.propTypes = {
  data: PropTypes.array.isRequired,
};