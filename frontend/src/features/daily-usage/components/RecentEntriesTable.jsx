import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { LoadingSkeleton } from '@/components/feedback/LoadingSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Activity } from 'lucide-react';

export function RecentEntriesTable({ entries = [], isLoading }) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} />;
  }

  if (!entries || entries.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No usage entries yet"
        description="Recorded material usage will appear here."
      />
    );
  }

  const materialKeys = useMemo(() => {
    const keys = new Set();
    entries.forEach((entry) => {
      const matName = entry.materialName || entry.material_name || entry.category || 'Material';
      keys.add(matName);
    });
    return Array.from(keys);
  }, [entries]);

  const groupedData = useMemo(() => {
    const map = {};
    entries.forEach((entry) => {
      const date = entry.usageDate || entry.usage_date || new Date().toISOString().split('T')[0];
      if (!map[date]) {
        map[date] = { date, total: 0 };
        materialKeys.forEach((k) => { map[date][k] = 0; });
      }
      const matName = entry.materialName || entry.material_name || entry.category || 'Material';
      const qty = Number(entry.quantityUsed || entry.quantity_used || 0);
      map[date][matName] = (map[date][matName] || 0) + qty;
      map[date].total += qty;
    });
    return Object.values(map).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, materialKeys]);

  return (
    <div className="rounded-card border border-border bg-background p-6">
      <h3 className="text-lg font-bold text-text-primary mb-4">Recent entries</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">DATE</th>
              {materialKeys.map((mat) => (
                <th key={mat} className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">
                  {mat}
                </th>
              ))}
              <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">TOTAL</th>
              <th className="text-right text-xs font-semibold text-text-secondary uppercase tracking-wide py-3">RECORDED BY</th>
            </tr>
          </thead>
          <tbody>
            {groupedData.map((row) => (
              <tr key={row.date} className="border-b border-border last:border-0">
                <td className="py-4 text-sm font-semibold text-text-primary">
                  {format(new Date(row.date), 'MMM d, yyyy')}
                </td>
                {materialKeys.map((mat) => (
                  <td key={mat} className="py-4 text-sm text-text-secondary">
                    {row[mat] || 0}
                  </td>
                ))}
                <td className="py-4 text-sm font-semibold text-text-primary">{row.total}</td>
                <td className="py-4 text-sm text-text-secondary text-right">System / Admin</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

RecentEntriesTable.propTypes = {
  entries: PropTypes.array,
  isLoading: PropTypes.bool,
};