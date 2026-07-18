/**
 * aggregateDailyUsage.js — groups flat DailyUsageEntry records into
 * per-day totals by material category, shaped for recharts' <BarChart>
 * (one object per date, with a numeric key per category series).
 *
 * Example output:
 * [
 *   { date: 'Jul 10', steel: 45, aluminum: 22, plastic: 18, total: 85 },
 *   { date: 'Jul 11', steel: 52, aluminum: 28, plastic: 20, total: 100 },
 *   ...
 * ]
 *
 * @param {DailyUsageEntry[]} entries
 * @returns {Array<{date: string, steel: number, aluminum: number, plastic: number, total: number}>}
 */
export function aggregateDailyUsage(entries) {
  const byDate = {};

  entries.forEach((entry) => {
    const dateKey = entry.usageDate;

    if (!byDate[dateKey]) {
      byDate[dateKey] = { date: dateKey, steel: 0, aluminum: 0, plastic: 0, total: 0 };
    }

    // Only known categories get bucketed into the chart series;
    // anything outside steel/aluminum/plastic is still counted in
    // `total` but won't render its own bar segment.
    if (byDate[dateKey][entry.materialCategory] !== undefined) {
      byDate[dateKey][entry.materialCategory] += entry.quantityUsed;
    }
    byDate[dateKey].total += entry.quantityUsed;
  });

  return Object.values(byDate).sort((a, b) => new Date(a.date) - new Date(b.date));
}