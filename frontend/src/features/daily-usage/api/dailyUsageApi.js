import { api } from '@/services/api';

export async function fetchDailyUsage() {
  const response = await api.get('/daily-usage');
  return response.data || response;
}

export async function createDailyUsage(usageData) {
  const response = await api.post('/daily-usage', usageData);
  return response.data || response;
}