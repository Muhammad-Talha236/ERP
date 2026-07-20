/**
 * getWageStatusVariant — maps a wage record's payment status to a
 * Badge variant: Paid (green), Partial (blue/info — some money has
 * moved but not fully settled), Pending (amber — nothing paid yet).
 *
 * @param {string} status
 * @returns {'success'|'warning'|'info'|'neutral'}
 */
export function getWageStatusVariant(status) {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Partial':
      return 'info';
    case 'Pending':
      return 'warning';
    default:
      return 'neutral';
  }
}