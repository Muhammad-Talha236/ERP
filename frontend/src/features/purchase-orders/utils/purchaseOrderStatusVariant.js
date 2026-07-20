/**
 * getPOStatusVariant — maps a PO's status to a Badge variant,
 * matching the screenshot: Received (green), Sent (blue/info),
 * Draft (neutral), Cancelled (red).
 */
export function getPOStatusVariant(status) {
  switch (status) {
    case 'Received':
      return 'success';
    case 'Sent':
      return 'info';
    case 'Draft':
      return 'neutral';
    case 'Cancelled':
      return 'danger';
    default:
      return 'neutral';
  }
}

/**
 * getPOPaymentVariant — maps a PO's payment status to a Badge
 * variant: Paid (green), Partial (amber), Unpaid (red).
 */
export function getPOPaymentVariant(status) {
  switch (status) {
    case 'Paid':
      return 'success';
    case 'Partial':
      return 'warning';
    case 'Unpaid':
      return 'danger';
    default:
      return 'neutral';
  }
}