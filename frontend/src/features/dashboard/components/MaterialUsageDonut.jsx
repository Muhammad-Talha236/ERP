import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { materialUsageBreakdown } from '@/mocks/data/dashboardTrends.mock';

/**
 * MaterialUsageDonut — "Material Usage / By material this week"
 * donut chart, matching the Dashboard screenshot exactly.
 */
export function MaterialUsageDonut() {
  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-lg font-bold text-text-primary">Material Usage</h3>
      <p className="text-sm text-text-secondary mb-4">By material this week</p>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={materialUsageBreakdown}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {materialUsageBreakdown.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {materialUsageBreakdown.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}