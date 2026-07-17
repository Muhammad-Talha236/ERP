/**
 * enums.js — fixed-value constants matching backend ENUM columns.
 *
 * These mirror the database design docs exactly (see
 * docs/04_Database_Design_Part2.md, Part1) so that when the real
 * API returns these string values, our frontend already expects
 * the exact same casing/spelling — no silent mismatches.
 *
 * Using frozen objects (not plain strings scattered in code) gives
 * us autocomplete (EMPLOYEE_STATUS.ACTIVE) and a single source of
 * truth if a value ever needs to change.
 */

export const EMPLOYEE_STATUS = Object.freeze({
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ON_LEAVE: 'On Leave',
});

export const SALARY_TYPE = Object.freeze({
  DAILY: 'Daily',
  MONTHLY: 'Monthly',
  PIECE_RATE: 'Piece Rate',
});

export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LEAVE: 'Leave',
  HALF_DAY: 'Half Day',
  HOLIDAY: 'Holiday',
});

export const LEAVE_REQUEST_STATUS = Object.freeze({
  PENDING: 'Pending',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  REJECTED: 'Rejected',
});

export const WAGE_PAYMENT_STATUS = Object.freeze({
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  PAID: 'Paid',
  PROCESSING: 'Processing',
});

export const GENDER = Object.freeze({
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
});