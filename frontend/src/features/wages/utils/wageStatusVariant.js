/**
 * getWageStatusVariant — maps a wage record's payment status to a
 * Badge variant, matching the screenshot's colors: Paid (green),
 * Pending (amber), Processing (blue/info).
 *
 * @param {string} status
 * @returns {'success'|'warning'|'info'|'neutral'}
 */
export function getWageStatusVariant(status) {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'info';
    case 'Partial':
      return 'warning';
    default:
      return 'neutral';
  }
}