

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

const DYNAMIC_COLORS = ['#3B82F6', '#F59E0B', '#22C55E', '#0EA5E9', '#8B5CF6', '#EC4899'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-input border border-border bg-background px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-text-primary mb-2">
        {format(new Date(label), 'MMM d, yyyy')}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.dataKey} : {entry.value}
        </p>
      ))}
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

export function ConsumptionChart({ entries = [] }) {
  const materialKeys = useMemo(() => {
    const keys = new Set();
    entries.forEach((entry) => {
      const matName = entry.materialName || entry.material_name || entry.category || 'Material';
      keys.add(matName);
    });
    return Array.from(keys);
  }, [entries]);

  const chartData = useMemo(() => {
    const map = {};
    entries.forEach((entry) => {
      const date = entry.usageDate || entry.usage_date || new Date().toISOString().split('T')[0];
      if (!map[date]) {
        map[date] = { date };
        materialKeys.forEach((k) => { map[date][k] = 0; });
      }
      const matName = entry.materialName || entry.material_name || entry.category || 'Material';
      const qty = Number(entry.quantityUsed || entry.quantity_used || 0);
      map[date][matName] = (map[date][matName] || 0) + qty;
    });
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [entries, materialKeys]);

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-lg font-bold text-text-primary">Material consumption trends</h3>
      <p className="text-sm text-text-secondary mb-6">By recorded material usage</p>

      {chartData.length === 0 ? (
        <p className="text-sm text-text-secondary italic text-center py-10">No consumption data available for chart.</p>
      ) : (
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
            {materialKeys.map((mat, index) => (
              <Bar
                key={mat}
                dataKey={mat}
                fill={DYNAMIC_COLORS[index % DYNAMIC_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

ConsumptionChart.propTypes = {
  entries: PropTypes.array.isRequired,
};