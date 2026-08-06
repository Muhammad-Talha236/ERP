import { api } from '@/services/api';

export async function fetchAttendance(params = {}) {
  const response = await api.get('/attendance', { params });
  return response.attendance;
}

export async function markAttendance(data) {
  const response = await api.post('/attendance', data);
  return response.attendance;
}

export async function updateAttendance(id, updates) {
  const response = await api.put(`/attendance/${id}`, updates);
  return response.attendance;
}
export async function editLeaveRequest(id, data) {
  const response = await api.put(`/attendance/leave-requests/${id}`, data);
  return response.leaveRequest;
}

export async function fetchLeaveRequests() {
  const response = await api.get('/attendance/leave-requests');
  return response.leaveRequests;
}

export async function createLeaveRequest(data) {
  const response = await api.post('/attendance/leave-requests', data);
  return response.leaveRequest;
}

export async function updateLeaveRequestStatus(id, status) {
  const response = await api.patch(`/attendance/leave-requests/${id}`, { status });
  return response.leaveRequest;
}