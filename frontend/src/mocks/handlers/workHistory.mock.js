import { workHistoryMockData } from '@/mocks/data/workHistory.mock';

const DELAY_MS = 300;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates GET /api/v1/employees/{id}/history
 *
 * Returns entries sorted newest-first, matching how a timeline
 * UI typically wants to display history (most recent event on top).
 *
 * @param {string} employeeId
 * @returns {Promise<WorkHistoryEntry[]>}
 */
export async function fetchEmployeeWorkHistory(employeeId) {
  await wait(DELAY_MS);

  return workHistoryMockData
    .filter((entry) => entry.employeeId === employeeId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}