/**
 * getWageStatusVariant — payment status badge: Paid (green),
 * Partial (blue/info), Pending (amber).
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

/**
 * getPayrollStatusVariant — payroll WORKFLOW status badge, separate
 * from payment status: Draft (neutral), Calculated (info),
 * Approved (warning — awaiting payment), Paid (success).
 */
export function getPayrollStatusVariant(status) {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Approved':
      return 'warning';
    case 'Calculated':
      return 'info';
    case 'Draft':
    default:
      return 'neutral';
  }
}