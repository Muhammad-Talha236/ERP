/**
 * dashboardTrends.mock.js — small sparkline datasets for each stat
 * card, plus the donut chart's material usage breakdown and the
 * department attendance bar data. Kept separate from module data
 * since these are presentation-only trend shapes, not records tied
 * to a specific entity.
 */

export const employeeTrendData = [210, 225, 230, 228, 235, 240, 248];
export const attendanceTrendData = [88, 90, 91, 89, 92, 93, 93];
export const productionTrendData = [28, 30, 33, 31, 35, 36, 37];
export const materialStockTrendData = [13200, 13000, 12800, 12700, 12600, 12550, 12480];
export const pendingPaymentsTrendData = [52000, 51000, 50200, 49800, 49000, 48600, 48320];
export const revenueTrendData = [410, 425, 440, 455, 465, 475, 482];

export const materialUsageBreakdown = [
  { name: 'Steel', value: 35, color: '#3B82F6' },
  { name: 'Aluminum', value: 25, color: '#F59E0B' },
  { name: 'Plastic', value: 20, color: '#22C55E' },
  { name: 'Rubber', value: 12, color: '#0EA5E9' },
  { name: 'Other', value: 8, color: '#F59E0B' },
];

export const departmentAttendanceData = [
  { department: 'Assembly', present: 82, absent: 18 },
  { department: 'Quality', present: 88, absent: 12 },
  { department: 'Maintenance', present: 75, absent: 25 },
];