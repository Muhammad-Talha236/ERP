/**
 * getProductionOrderStatusVariant — maps a production order's
 * status to a Badge variant, matching the Kanban screenshot's
 * colors: Pending (neutral), In Progress (info/blue), Quality
 * Check (warning/amber), Completed (success/green), Cancelled (danger).
 */
export function getProductionOrderStatusVariant(status) {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'info';
    case 'Quality Check':
      return 'warning';
    case 'Cancelled':
      return 'danger';
    case 'Pending':
    default:
      return 'neutral';
  }
}

/**
 * getPriorityVariant — maps priority to a Badge variant, matching
 * the screenshot: High (danger/red), Medium (warning/amber), Low (neutral).
 */
export function getPriorityVariant(priority) {
  switch (priority) {
    case 'High':
      return 'danger';
    case 'Medium':
      return 'warning';
    case 'Low':
    default:
      return 'neutral';
  }
}