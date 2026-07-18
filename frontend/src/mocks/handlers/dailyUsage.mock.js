import { dailyUsageMockData } from '@/mocks/data/dailyUsage.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let usageEntries = [...dailyUsageMockData];

/**
 * Simulates GET /api/v1/material-usage
 * Supports optional date range filtering (?from=&to=).
 *
 * @param {{ from?: string, to?: string }} params
 * @returns {Promise<DailyUsageEntry[]>}
 */
export async function fetchDailyUsage(params = {}) {
  await wait(DELAY_MS);

  let result = [...usageEntries];

  if (params.from) {
    result = result.filter((e) => e.usageDate >= params.from);
  }
  if (params.to) {
    result = result.filter((e) => e.usageDate <= params.to);
  }

  // Sort oldest-first so charts/tables render in chronological order
  return result.sort((a, b) => new Date(a.usageDate) - new Date(b.usageDate));
}

/**
 * Simulates POST /api/v1/material-usage (Record Usage)
 * @param {Omit<DailyUsageEntry, 'id'>} newEntry
 * @returns {Promise<DailyUsageEntry>}
 */
export async function createDailyUsageEntry(newEntry) {
  await wait(DELAY_MS);

  const entry = {
    id: `du-${Date.now()}`,
    ...newEntry,
  };

  usageEntries = [...usageEntries, entry];
  return entry;
}