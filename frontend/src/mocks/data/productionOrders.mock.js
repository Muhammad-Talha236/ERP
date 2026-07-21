/**
 * productionOrders.mock.js — CUSTOMER purchase orders that drive
 * production. Distinct from purchaseOrders.mock.js (the SUPPLIER-
 * facing "buy raw materials" module).
 *
 * Matches PO Flow Step 1-2: client submits a requirement (product +
 * quantity + price), a unique PO number is generated.
 *
 * @typedef {Object} ProductionOrder
 * @property {string} id
 * @property {string} poNumber
 * @property {string} customerId
 * @property {string} customerName
 * @property {string} productName
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {string} workflowTemplateId  - which template was used to SEED this order's steps (reference only, for display)
 * @property {number} currentStageOrder   - overall order progress, 1-indexed
 * @property {'Pending'|'In Progress'|'Quality Check'|'Completed'|'Cancelled'} status
 * @property {'Low'|'Medium'|'High'} priority
 * @property {string} orderDate
 * @property {string} deliveryDate
 */

export const productionOrdersMockData = [
  { id: 'po-2401', poNumber: 'PO-2401', customerId: 'cust-002', customerName: 'Zenith Motors Apparel', productName: 'Gearbox Housing A2', quantity: 250, unitPrice: 45, workflowTemplateId: 'wft-polo', currentStageOrder: 1, status: 'Pending', priority: 'High', orderDate: '2026-07-10', deliveryDate: '2026-07-22' },
  { id: 'po-2402', poNumber: 'PO-2402', customerId: 'cust-001', customerName: 'Nike Pakistan', productName: 'Steel Bracket B7', quantity: 800, unitPrice: 12, workflowTemplateId: 'wft-polo', currentStageOrder: 3, status: 'In Progress', priority: 'High', orderDate: '2026-07-08', deliveryDate: '2026-07-19' },
  { id: 'po-2403', poNumber: 'PO-2403', customerId: 'cust-003', customerName: 'MetalWorks Uniforms', productName: 'Aluminum Frame F1', quantity: 120, unitPrice: 60, workflowTemplateId: 'wft-denim', currentStageOrder: 2, status: 'In Progress', priority: 'Medium', orderDate: '2026-07-09', deliveryDate: '2026-07-20' },
  { id: 'po-2404', poNumber: 'PO-2404', customerId: 'cust-001', customerName: 'Nike Pakistan', productName: 'Rubber Seal Kit', quantity: 3000, unitPrice: 3, workflowTemplateId: 'wft-polo', currentStageOrder: 5, status: 'Quality Check', priority: 'Medium', orderDate: '2026-07-05', deliveryDate: '2026-07-18' },
  { id: 'po-2405', poNumber: 'PO-2405', customerId: 'cust-002', customerName: 'Zenith Motors Apparel', productName: 'Copper Coil C4', quantity: 60, unitPrice: 90, workflowTemplateId: 'wft-denim', currentStageOrder: 6, status: 'Completed', priority: 'Low', orderDate: '2026-07-02', deliveryDate: '2026-07-15' },
  { id: 'po-2406', poNumber: 'PO-2406', customerId: 'cust-003', customerName: 'MetalWorks Uniforms', productName: 'Motor Mount M2', quantity: 500, unitPrice: 25, workflowTemplateId: 'wft-polo', currentStageOrder: 1, status: 'Pending', priority: 'High', orderDate: '2026-07-11', deliveryDate: '2026-07-24' },
  { id: 'po-2407', poNumber: 'PO-2407', customerId: 'cust-001', customerName: 'Nike Pakistan', productName: 'Chassis Panel P8', quantity: 180, unitPrice: 35, workflowTemplateId: 'wft-denim', currentStageOrder: 1, status: 'Pending', priority: 'Low', orderDate: '2026-07-12', deliveryDate: '2026-07-27' },
  { id: 'po-2408', poNumber: 'PO-2408', customerId: 'cust-002', customerName: 'Zenith Motors Apparel', productName: 'Valve Assembly V3', quantity: 400, unitPrice: 22, workflowTemplateId: 'wft-polo', currentStageOrder: 6, status: 'Completed', priority: 'Medium', orderDate: '2026-07-01', deliveryDate: '2026-07-12' },
];