/**
 * purchaseOrders.mock.js — fake purchase order (supplier order) data.
 *
 * @typedef {Object} PurchaseOrderItem
 * @property {string} materialId
 * @property {string} materialName
 * @property {number} quantity
 * @property {number} unitPrice
 *
 * @typedef {Object} PurchaseOrder
 * @property {string} id
 * @property {string} poNumber
 * @property {string} supplierId
 * @property {string} supplierName
 * @property {PurchaseOrderItem[]} items
 * @property {number} totalAmount
 * @property {number} paidAmount        - cumulative amount paid so far (partial/full/advance combined)
 * @property {'Draft'|'Sent'|'Received'|'Cancelled'} status
 * @property {'Unpaid'|'Partial'|'Paid'} paymentStatus - DERIVED from paidAmount vs totalAmount
 * @property {string} createdDate       - ISO date string
 * @property {string} expectedDeliveryDate - ISO date string
 * @property {string|null} receivedDate - ISO date string, set when marked Received
 */

export const purchaseOrdersMockData = [
  {
    id: 'po-8801',
    poNumber: 'PUR-8801',
    supplierId: 'sup-ironcore',
    supplierName: 'IronCore Ltd.',
    items: [{ materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', quantity: 12, unitPrice: 1535 }],
    totalAmount: 18420,
    paidAmount: 18420,
    status: 'Received',
    paymentStatus: 'Paid',
    createdDate: '2026-07-08',
    expectedDeliveryDate: '2026-07-15',
    receivedDate: '2026-07-14',
  },
  {
    id: 'po-8802',
    poNumber: 'PUR-8802',
    supplierId: 'sup-alumwest',
    supplierName: 'AlumWest',
    items: [{ materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', quantity: 5, unitPrice: 1248 }],
    totalAmount: 6240,
    paidAmount: 0,
    status: 'Sent',
    paymentStatus: 'Unpaid',
    createdDate: '2026-07-10',
    expectedDeliveryDate: '2026-07-24',
    receivedDate: null,
  },
  {
    id: 'po-8803',
    poNumber: 'PUR-8803',
    supplierId: 'sup-polychem',
    supplierName: 'PolyChem',
    items: [{ materialId: 'mat-003', materialName: 'PP Granules', quantity: 8, unitPrice: 2762.5 }],
    totalAmount: 22100,
    paidAmount: 10000,
    status: 'Received',
    paymentStatus: 'Partial',
    createdDate: '2026-07-11',
    expectedDeliveryDate: '2026-07-18',
    receivedDate: '2026-07-17',
  },
  {
    id: 'po-8804',
    poNumber: 'PUR-8804',
    supplierId: 'sup-flexseal',
    supplierName: 'FlexSeal',
    items: [{ materialId: 'mat-004', materialName: 'Rubber Gaskets', quantity: 3, unitPrice: 1040 }],
    totalAmount: 3120,
    paidAmount: 0,
    status: 'Draft',
    paymentStatus: 'Unpaid',
    createdDate: '2026-07-14',
    expectedDeliveryDate: '2026-07-28',
    receivedDate: null,
  },
  {
    id: 'po-8805',
    poNumber: 'PUR-8805',
    supplierId: 'sup-bolthub',
    supplierName: 'BoltHub',
    items: [{ materialId: 'mat-005', materialName: 'M8 Hex Bolts', quantity: 20, unitPrice: 274 }],
    totalAmount: 5480,
    paidAmount: 5480,
    status: 'Received',
    paymentStatus: 'Paid',
    createdDate: '2026-07-15',
    expectedDeliveryDate: '2026-07-20',
    receivedDate: '2026-07-19',
  },
  {
    id: 'po-8806',
    poNumber: 'PUR-8806',
    supplierId: 'sup-electrosup',
    supplierName: 'ElectroSup',
    items: [{ materialId: 'mat-006', materialName: 'Copper Wire 2.5mm', quantity: 6, unitPrice: 1643.33 }],
    totalAmount: 9860,
    paidAmount: 0,
    status: 'Cancelled',
    paymentStatus: 'Unpaid',
    createdDate: '2026-07-16',
    expectedDeliveryDate: '2026-07-22',
    receivedDate: null,
  },
];