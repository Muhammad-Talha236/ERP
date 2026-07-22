import { format, subDays, addDays } from 'date-fns';

/**
 * attendance.mock.js — fake daily attendance records.
 *
 * IMPORTANT: dates are computed RELATIVE to the real current date
 * (new Date()), not hardcoded to a fixed calendar date. Earlier
 * versions used fixed strings like '2026-07-15', which meant "today's
 * records" on the Attendance page came up empty whenever the app was
 * actually run on a different real-world date than that hardcoded
 * value — exactly the bug reported. Using subDays/addDays from the
 * actual "now" guarantees there's always data for "today", "a few
 * days ago", etc., regardless of when the app is opened.
 *
 * @typedef {Object} AttendanceRecord
 * @property {string} id
 * @property {string} employeeId
 * @property {string} employeeName
 * @property {string} attendanceDate
 * @property {'Present'|'Absent'|'Leave'|'Half Day'|'Holiday'|'Late'} status
 * @property {string|null} checkIn
 * @property {string|null} checkOut
 * @property {number} overtimeHours
 * @property {string|null} remarks
 */

const today = new Date();
const dateStr = (offsetDays) => format(addDays(today, offsetDays), 'yyyy-MM-dd');

export const attendanceMockData = [
  // --- Today (offset 0) ---
  { id: 'att-007', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: dateStr(0), status: 'Present', checkIn: '07:05', checkOut: '16:10', overtimeHours: 0, remarks: null },
  { id: 'att-008', employeeId: 'emp-002', employeeName: 'Marcus Chen', attendanceDate: dateStr(0), status: 'Present', checkIn: '08:00', checkOut: '17:00', overtimeHours: 0, remarks: null },
  { id: 'att-009', employeeId: 'emp-003', employeeName: 'Aisha Rahman', attendanceDate: dateStr(0), status: 'Present', checkIn: '09:40', checkOut: '18:00', overtimeHours: 0, remarks: 'Arrived late' },
  { id: 'att-010', employeeId: 'emp-007', employeeName: 'Fatima Sheikh', attendanceDate: dateStr(0), status: 'Absent', checkIn: null, checkOut: null, overtimeHours: 0, remarks: null },
  { id: 'att-011', employeeId: 'emp-008', employeeName: 'Omar Farooq', attendanceDate: dateStr(0), status: 'Half Day', checkIn: '08:00', checkOut: '12:30', overtimeHours: 0, remarks: 'Left early, personal reasons' },

  // --- A couple days ago (offset -2), matches your earlier "check-in list" example ---
  { id: 'att-001', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: dateStr(-2), status: 'Present', checkIn: '07:00', checkOut: '16:00', overtimeHours: 0, remarks: null },
  { id: 'att-002', employeeId: 'emp-002', employeeName: 'Marcus Chen', attendanceDate: dateStr(-2), status: 'Present', checkIn: '08:11', checkOut: '17:07', overtimeHours: 0, remarks: null },
  { id: 'att-003', employeeId: 'emp-003', employeeName: 'Aisha Rahman', attendanceDate: dateStr(-2), status: 'Present', checkIn: '09:22', checkOut: '18:14', overtimeHours: 1, remarks: 'Arrived late' },
  { id: 'att-004', employeeId: 'emp-004', employeeName: 'Diego Alvarez', attendanceDate: dateStr(-2), status: 'Present', checkIn: '07:33', checkOut: '16:21', overtimeHours: 0, remarks: null },
  { id: 'att-005', employeeId: 'emp-005', employeeName: 'Sofia Ivanova', attendanceDate: dateStr(-2), status: 'Leave', checkIn: null, checkOut: null, overtimeHours: 0, remarks: 'Approved sick leave' },
  { id: 'att-006', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', attendanceDate: dateStr(-2), status: 'Present', checkIn: '09:55', checkOut: '18:35', overtimeHours: 0.5, remarks: null },

  // --- Scattered days across the current month, for calendar grid coverage ---
  { id: 'att-012', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: dateStr(-17), status: 'Present', checkIn: '07:02', checkOut: '16:05', overtimeHours: 0, remarks: null },
  { id: 'att-013', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: dateStr(-11), status: 'Absent', checkIn: null, checkOut: null, overtimeHours: 0, remarks: null },
  { id: 'att-014', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: dateStr(-5), status: 'Present', checkIn: '07:01', checkOut: '16:03', overtimeHours: 0, remarks: null },
  { id: 'att-015', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: dateStr(5), status: 'Present', checkIn: '07:00', checkOut: '16:00', overtimeHours: 0, remarks: null },
  { id: 'att-016', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: dateStr(13), status: 'Absent', checkIn: null, checkOut: null, overtimeHours: 0, remarks: null },
];