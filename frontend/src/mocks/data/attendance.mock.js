/**
 * attendance.mock.js — fake daily attendance records.
 *
 * @typedef {Object} AttendanceRecord
 * @property {string} id
 * @property {string} employeeId       - FK to Employee.id
 * @property {string} employeeName     - denormalized for display
 * @property {string} attendanceDate   - ISO date string (YYYY-MM-DD)
 * @property {'Present'|'Absent'|'Leave'|'Half Day'|'Holiday'|'Late'} status
 * @property {string|null} checkIn     - "HH:mm" 24hr format, or null
 * @property {string|null} checkOut    - "HH:mm" 24hr format, or null
 * @property {number} overtimeHours
 * @property {string|null} remarks
 *
 * NOTE: 'Late' isn't in the official ATTENDANCE_STATUS enum from the
 * DB design doc (which only lists Present/Absent/Leave/Half Day/
 * Holiday), but your UI screenshots clearly show a distinct "Late"
 * badge. We treat "Late" as a Present-day check-in that happened
 * after a threshold time — a UI-level distinction layered on top of
 * the Present status, computed by a helper (see
 * attendanceStatusVariant.js) rather than a separate enum value.
 * This keeps our data shape aligned with the documented backend
 * enum while still matching the design visually.
 */

export const attendanceMockData = [
  // --- July 15, 2026 (matches your screenshot's check-in list) ---
  { id: 'att-001', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: '2026-07-15', status: 'Present', checkIn: '07:00', checkOut: '16:00', overtimeHours: 0, remarks: null },
  { id: 'att-002', employeeId: 'emp-002', employeeName: 'Marcus Chen', attendanceDate: '2026-07-15', status: 'Present', checkIn: '08:11', checkOut: '17:07', overtimeHours: 0, remarks: null },
  { id: 'att-003', employeeId: 'emp-003', employeeName: 'Aisha Rahman', attendanceDate: '2026-07-15', status: 'Present', checkIn: '09:22', checkOut: '18:14', overtimeHours: 1, remarks: 'Arrived late' },
  { id: 'att-004', employeeId: 'emp-004', employeeName: 'Diego Alvarez', attendanceDate: '2026-07-15', status: 'Present', checkIn: '07:33', checkOut: '16:21', overtimeHours: 0, remarks: null },
  { id: 'att-005', employeeId: 'emp-005', employeeName: 'Sofia Ivanova', attendanceDate: '2026-07-15', status: 'Leave', checkIn: null, checkOut: null, overtimeHours: 0, remarks: 'Approved sick leave' },
  { id: 'att-006', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', attendanceDate: '2026-07-15', status: 'Present', checkIn: '09:55', checkOut: '18:35', overtimeHours: 0.5, remarks: null },

  // --- July 17, 2026 (today, per screenshots) ---
  { id: 'att-007', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: '2026-07-17', status: 'Present', checkIn: '07:05', checkOut: '16:10', overtimeHours: 0, remarks: null },
  { id: 'att-008', employeeId: 'emp-002', employeeName: 'Marcus Chen', attendanceDate: '2026-07-17', status: 'Present', checkIn: '08:00', checkOut: '17:00', overtimeHours: 0, remarks: null },
  { id: 'att-009', employeeId: 'emp-003', employeeName: 'Aisha Rahman', attendanceDate: '2026-07-17', status: 'Present', checkIn: '09:40', checkOut: '18:00', overtimeHours: 0, remarks: 'Arrived late' },
  { id: 'att-010', employeeId: 'emp-007', employeeName: 'Fatima Sheikh', attendanceDate: '2026-07-17', status: 'Absent', checkIn: null, checkOut: null, overtimeHours: 0, remarks: null },
  { id: 'att-011', employeeId: 'emp-008', employeeName: 'Omar Farooq', attendanceDate: '2026-07-17', status: 'Half Day', checkIn: '08:00', checkOut: '12:30', overtimeHours: 0, remarks: 'Left early, personal reasons' },

  // --- Scattered days across July for calendar grid coverage ---
  { id: 'att-012', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: '2026-07-04', status: 'Present', checkIn: '07:02', checkOut: '16:05', overtimeHours: 0, remarks: null },
  { id: 'att-013', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: '2026-07-10', status: 'Absent', checkIn: null, checkOut: null, overtimeHours: 0, remarks: null },
  { id: 'att-014', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: '2026-07-16', status: 'Present', checkIn: '07:01', checkOut: '16:03', overtimeHours: 0, remarks: null },
  { id: 'att-015', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: '2026-07-22', status: 'Present', checkIn: '07:00', checkOut: '16:00', overtimeHours: 0, remarks: null },
  { id: 'att-016', employeeId: 'emp-001', employeeName: 'Priya Menon', attendanceDate: '2026-07-30', status: 'Absent', checkIn: null, checkOut: null, overtimeHours: 0, remarks: null },
];