/**
 * materials.mock.js — fake raw material inventory data.
 *
 * @typedef {Object} Material
 * @property {string} id
 * @property {string} materialCode
 * @property {string} materialName
 * @property {string} categoryId
 * @property {string} category        - denormalized for display
 * @property {'Meter'|'Piece'|'Kg'|'Roll'|'Box'} unit
 * @property {number} currentStock
 * @property {number} minimumStock
 * @property {number} purchasePrice
 * @property {'Active'|'Inactive'} status
 * @property {string} supplierName    - denormalized for display
 * @property {string} lastUpdated     - ISO datetime string
 */

export const materialsMockData = [
  {
    id: 'mat-001',
    materialCode: 'STL-CR-3mm',
    materialName: 'Cold Rolled Steel Sheet',
    categoryId: 'cat-metal',
    category: 'Metal',
    unit: 'Piece',
    currentStock: 1240,
    minimumStock: 400,
    purchasePrice: 45,
    status: 'Active',
    supplierName: 'IronCore Ltd.',
    lastUpdated: '2026-07-17T08:00:00Z', // "2h ago" relative to a 10am reference
  },
  {
    id: 'mat-002',
    materialCode: 'AL-RD-12',
    materialName: 'Aluminum Rods 12mm',
    categoryId: 'cat-metal',
    category: 'Metal',
    unit: 'Piece',
    currentStock: 320,
    minimumStock: 500,
    purchasePrice: 30,
    status: 'Active',
    supplierName: 'AlumWest',
    lastUpdated: '2026-07-17T05:00:00Z', // "5h ago"
  },
  {
    id: 'mat-003',
    materialCode: 'PP-GR-01',
    materialName: 'PP Granules',
    categoryId: 'cat-plastic',
    category: 'Plastic',
    unit: 'Kg',
    currentStock: 8600,
    minimumStock: 2000,
    purchasePrice: 2.5,
    status: 'Active',
    supplierName: 'PolyChem',
    lastUpdated: '2026-07-16T10:00:00Z', // "1d ago"
  },
  {
    id: 'mat-004',
    materialCode: 'RB-GK-8',
    materialName: 'Rubber Gaskets',
    categoryId: 'cat-rubber',
    category: 'Rubber',
    unit: 'Piece',
    currentStock: 180,
    minimumStock: 300,
    purchasePrice: 1.2,
    status: 'Active',
    supplierName: 'FlexSeal Co.',
    lastUpdated: '2026-07-17T03:00:00Z',
  },
  {
    id: 'mat-005',
    materialCode: 'FS-M8-HX',
    materialName: 'M8 Hex Bolts',
    categoryId: 'cat-fasteners',
    category: 'Fasteners',
    unit: 'Piece',
    currentStock: 24000,
    minimumStock: 5000,
    purchasePrice: 0.15,
    status: 'Active',
    supplierName: 'BoltWorks',
    lastUpdated: '2026-07-16T06:00:00Z',
  },
  {
    id: 'mat-006',
    materialCode: 'CU-WR-25',
    materialName: 'Copper Wire 2.5mm',
    categoryId: 'cat-electrical',
    category: 'Electrical',
    unit: 'Roll',
    currentStock: 950,
    minimumStock: 300,
    purchasePrice: 18,
    status: 'Active',
    supplierName: 'ElectroSupply',
    lastUpdated: '2026-07-17T01:00:00Z',
  },
];