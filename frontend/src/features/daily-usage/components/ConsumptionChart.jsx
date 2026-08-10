import { useMemo, useState } from 'react';
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
import {
  format,
  parseISO,
  subDays,
} from 'date-fns';

const DYNAMIC_COLORS = [
  '#3B82F6',
  '#F59E0B',
  '#22C55E',
  '#0EA5E9',
  '#8B5CF6',
  '#EC4899',
];

// --------------------------------------------------
// Get local date as YYYY-MM-DD string
// --------------------------------------------------
function getTodayDate() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
}

// --------------------------------------------------
// Normalize backend date strictly to YYYY-MM-DD
// --------------------------------------------------
function normalizeDate(value) {
  if (!value) return null;
  const str = String(value);
  if (str.includes('T')) {
    return str.split('T')[0];
  }
  return str.substring(0, 10);
}

// --------------------------------------------------
// Add days to a YYYY-MM-DD string accurately
// --------------------------------------------------
function addDaysToDateString(dateStr, daysToAdd) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day + daysToAdd);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

// --------------------------------------------------
// Tooltip
// --------------------------------------------------
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-md">
      <p className="mb-2 text-sm font-semibold text-text-primary">
        {format(parseISO(label), 'MMM d, yyyy')}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-sm"
          style={{ color: entry.color }}
        >
          {entry.dataKey}: {entry.value}
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

// --------------------------------------------------
// Component
// --------------------------------------------------
export function ConsumptionChart({ entries = [] }) {
  // --------------------------------------------------
  // Find latest actual entry date
  // --------------------------------------------------
  const latestDataDate = useMemo(() => {
    const validDates = entries
      .map((entry) =>
        normalizeDate(
          entry.usageDate ||
            entry.usage_date
        )
      )
      .filter(Boolean)
      .sort();
    return validDates.length > 0
      ? validDates[validDates.length - 1]
      : getTodayDate();
  }, [entries]);

  // --------------------------------------------------
  // Selected END date
  // --------------------------------------------------
  const [selectedDate, setSelectedDate] = useState(null);
  const endDate = selectedDate || latestDataDate;

  // --------------------------------------------------
  // Material names
  // --------------------------------------------------
  const materialKeys = useMemo(() => {
    const keys = new Set();
    entries.forEach((entry) => {
      const matName =
        entry.materialName ||
        entry.material_name ||
        entry.category ||
        'Material';
      keys.add(matName);
    });
    return Array.from(keys);
  }, [entries]);

  // --------------------------------------------------
  // Chart Data - EXACTLY 7 DAYS (String-based safe sync)
  // --------------------------------------------------
  const chartData = useMemo(() => {
    const map = {};

    // Generate exactly 7 days ending at `endDate` using string arithmetic
    for (let i = 6; i >= 0; i -= 1) {
      const dateKey = addDaysToDateString(endDate, -i);
      map[dateKey] = {
        date: dateKey,
      };
      materialKeys.forEach((material) => {
        map[dateKey][material] = 0;
      });
    }

    // ------------------------------------------------
    // Add actual entries to the exact date key
    // ------------------------------------------------
    entries.forEach((entry) => {
      const dateKey = normalizeDate(
        entry.usageDate ||
          entry.usage_date
      );
      if (!dateKey || !map[dateKey]) {
        return;
      }
      const matName =
        entry.materialName ||
        entry.material_name ||
        entry.category ||
        'Material';
      const qty = Number(
        entry.quantityUsed ??
          entry.quantity_used ??
          0
      );
      map[dateKey][matName] =
        (map[dateKey][matName] || 0) + qty;
    });

    return Object.values(map);
  }, [
    entries,
    materialKeys,
    endDate,
  ]);

  // --------------------------------------------------
  // Start / End display dates
  // --------------------------------------------------
  const startDisplayDate =
    chartData.length > 0
      ? chartData[0].date
      : endDate;
  const endDisplayDate =
    chartData.length > 0
      ? chartData[chartData.length - 1].date
      : endDate;

  // --------------------------------------------------
  // Empty state
  // --------------------------------------------------
  if (!entries || entries.length === 0) {
    return (
      <div className="w-full rounded-xl border border-border bg-background p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Material consumption trends
            </h2>
            <p className="text-sm text-text-secondary">
              By recorded material usage
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <label
              htmlFor="consumption-date"
              className="mb-1 block text-xs font-medium text-text-secondary"
            >
              End date
            </label>
            <input
              id="consumption-date"
              type="date"
              value={endDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary sm:w-auto"
            />
          </div>
        </div>
        <p className="py-10 text-center text-sm italic text-text-secondary">
          No consumption data available for chart.
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------
  return (
    <div className="w-full min-w-0 rounded-xl border border-border bg-background p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Material consumption trends
          </h2>
          <p className="text-sm text-text-secondary">
            By recorded material usage
          </p>
        </div>
        {/* End Date */}
        <div className="w-full sm:w-auto">
          <label
            htmlFor="consumption-date"
            className="mb-1 block text-xs font-medium text-text-secondary"
          >
            End date
          </label>
          <input
            id="consumption-date"
            type="date"
            value={endDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary sm:w-auto"
          />
        </div>
      </div>
      {/* 7-Day Range */}
      <div className="mb-3 mt-4 text-xs text-text-secondary">
        Showing{' '}
        <span className="font-medium text-text-primary">
          {format(
            parseISO(startDisplayDate),
            'MMM d, yyyy'
          )}
        </span>
        {' - '}
        <span className="font-medium text-text-primary">
          {format(
            parseISO(endDisplayDate),
            'MMM d, yyyy'
          )}
        </span>
      </div>
      {/* Chart */}
      <div className="w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height={320}
          minWidth={0}
        >
          <BarChart
            data={chartData}
            barGap={4}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                format(
                  parseISO(date),
                  'MMM d'
                )
              }
              tick={{
                fill:
                  'var(--color-text-secondary)',
                fontSize: 11,
              }}
              axisLine={{
                stroke:
                  'var(--color-border)',
              }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{
                fill:
                  'var(--color-text-secondary)',
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: 'var(--color-surface)',
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: 12,
                color:
                  'var(--color-text-secondary)',
                paddingTop: 8,
              }}
              iconType="square"
            />
            {materialKeys.map(
              (material, index) => (
                <Bar
                  key={material}
                  dataKey={material}
                  fill={
                    DYNAMIC_COLORS[
                      index %
                        DYNAMIC_COLORS.length
                    ]
                  }
                  radius={[
                    4,
                    4,
                    0,
                    0,
                  ]}
                />
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

ConsumptionChart.propTypes = {
  entries: PropTypes.array.isRequired,
};