import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/Badge';

const WEEKLY_PRODUCTION_DATA = [
  { day: 'Mon', units: 420, target: 500 },
  { day: 'Tue', units: 480, target: 500 },
  { day: 'Wed', units: 450, target: 500 },
  { day: 'Thu', units: 520, target: 500 },
  { day: 'Fri', units: 580, target: 500 },
  { day: 'Sat', units: 260, target: 500 },
  { day: 'Sun', units: 190, target: 500 },
];

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
 * ProductionOverviewChart — "Daily units produced vs target" line
 * chart, matching the Dashboard screenshot exactly.
 */
export function ProductionOverviewChart() {
  return (
    <div className="rounded-card border border-border bg-background p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Production Overview</h3>
          <p className="text-sm text-text-secondary">Daily units produced vs target</p>
        </div>
        <Badge variant="info">In Progress</Badge>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={WEEKLY_PRODUCTION_DATA}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="day" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--color-border)' }} tickLine={false} />
          <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 13, color: 'var(--color-text-secondary)' }} iconType="line" />
          <Line type="monotone" dataKey="units" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="6 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}