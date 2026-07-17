/**
 * getAttendanceStatusVariant — maps an attendance record's status
 * (including the UI-only "Late" distinction) to a Badge variant.
 *
 * @param {string} status
 * @returns {'success'|'warning'|'danger'|'info'|'neutral'}
 */
export function getAttendanceStatusVariant(status) {
  switch (status) {
    case 'Present':
      return 'success';
    case 'Late':
      return 'warning';
    case 'Absent':
      return 'danger';
    case 'Leave':
      return 'info';
    case 'Half Day':
      return 'warning';
    case 'Holiday':
      return 'neutral';
    default:
      return 'neutral';
  }
}

/**
 * getLeaveRequestStatusVariant — maps a leave request's status to
 * a Badge variant. Separate from attendance status since these are
 * conceptually different fields (LEAVE_REQUEST_STATUS enum vs
 * ATTENDANCE_STATUS enum per docs/04_Database_Design_Part2.md).
 *
 * @param {string} status
 * @returns {'success'|'warning'|'info'|'danger'|'neutral'}
 */
export function getLeaveRequestStatusVariant(status) {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'info';
    case 'Rejected':
      return 'danger';
    default:
      return 'neutral';
  }
}