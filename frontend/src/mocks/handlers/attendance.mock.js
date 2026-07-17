import { attendanceMockData } from '@/mocks/data/attendance.mock';
import { leaveRequestsMockData } from '@/mocks/data/leaveRequests.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let attendanceRecords = [...attendanceMockData];
let leaveRequests = [...leaveRequestsMockData];

/**
 * Simulates GET /api/v1/attendance
 * Supports the documented filters: ?date=, ?employeeId=, ?month=&year=
 *
 * @param {{ date?: string, employeeId?: string, month?: number, year?: number }} params
 * @returns {Promise<AttendanceRecord[]>}
 */
export async function fetchAttendance(params = {}) {
  await wait(DELAY_MS);

  let result = [...attendanceRecords];

  if (params.date) {
    result = result.filter((rec) => rec.attendanceDate === params.date);
  }

  if (params.employeeId) {
    result = result.filter((rec) => rec.employeeId === params.employeeId);
  }

  if (params.month && params.year) {
    result = result.filter((rec) => {
      const d = new Date(rec.attendanceDate);
      // getMonth() is 0-indexed, so +1 to match the human "month" param
      return d.getMonth() + 1 === params.month && d.getFullYear() === params.year;
    });
  }

  return result;
}

/**
 * Simulates POST /api/v1/attendance (Mark Attendance)
 * @param {Omit<AttendanceRecord, 'id'>} newRecord
 * @returns {Promise<AttendanceRecord>}
 */
export async function markAttendance(newRecord) {
  await wait(DELAY_MS);

  const record = {
    id: `att-${Date.now()}`,
    ...newRecord,
  };

  attendanceRecords = [record, ...attendanceRecords];
  return record;
}

/**
 * Simulates GET /api/v1/leave-requests (not explicitly documented
 * as its own endpoint yet, but implied by the Leave Requests table
 * in the UI — modeled the same way as other list endpoints).
 * @returns {Promise<LeaveRequest[]>}
 */
export async function fetchLeaveRequests() {
  await wait(DELAY_MS);
  return [...leaveRequests];
}