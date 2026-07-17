import { EMPLOYEE_STATUS } from '@/constants/enums';

/**
 * getEmployeeStatusVariant — maps an Employee's status string to a
 * Badge component variant.
 *
 * Kept in the employees feature folder (not shared code) because
 * this mapping is specific business logic: OTHER modules'
 * status fields (attendance, wages) have their own meanings and
 * will get their own separate mapper functions.
 *
 * @param {string} status - one of EMPLOYEE_STATUS values
 * @returns {'success'|'warning'|'neutral'}
 */
export function getEmployeeStatusVariant(status) {
  switch (status) {
    case EMPLOYEE_STATUS.ACTIVE:
      return 'success';
    case EMPLOYEE_STATUS.ON_LEAVE:
      return 'warning';
    case EMPLOYEE_STATUS.INACTIVE:
      return 'neutral';
    default:
      return 'neutral';
  }
}