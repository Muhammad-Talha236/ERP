/**
 * dailyUsage.mock.js — fake daily material consumption records.
 *
 * @typedef {Object} DailyUsageEntry
 * @property {string} id
 * @property {string} employeeId
 * @property {string} employeeName    - denormalized for display
 * @property {string} materialId
 * @property {string} materialName    - denormalized for display
 * @property {string} materialCategory - 'steel'|'aluminum'|'plastic' etc,
 *            used to group/chart consumption by category
 * @property {string} usageDate       - ISO date string
 * @property {number} quantityUsed
 * @property {string} unit
 * @property {number} wastageQuantity
 * @property {string|null} remarks
 */

export const dailyUsageMockData = [
  // Jul 10
  { id: 'du-001', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', materialCategory: 'steel', usageDate: '2026-07-10', quantityUsed: 45, unit: 'kg', wastageQuantity: 1, remarks: null },
  { id: 'du-002', employeeId: 'emp-004', employeeName: 'Diego Alvarez', materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', materialCategory: 'aluminum', usageDate: '2026-07-10', quantityUsed: 22, unit: 'kg', wastageQuantity: 0, remarks: null },
  { id: 'du-003', employeeId: 'emp-008', employeeName: 'Omar Farooq', materialId: 'mat-003', materialName: 'PP Granules', materialCategory: 'plastic', usageDate: '2026-07-10', quantityUsed: 18, unit: 'kg', wastageQuantity: 0.5, remarks: null },

  // Jul 11
  { id: 'du-004', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', materialCategory: 'steel', usageDate: '2026-07-11', quantityUsed: 52, unit: 'kg', wastageQuantity: 2, remarks: null },
  { id: 'du-005', employeeId: 'emp-004', employeeName: 'Diego Alvarez', materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', materialCategory: 'aluminum', usageDate: '2026-07-11', quantityUsed: 28, unit: 'kg', wastageQuantity: 1, remarks: null },
  { id: 'du-006', employeeId: 'emp-008', employeeName: 'Omar Farooq', materialId: 'mat-003', materialName: 'PP Granules', materialCategory: 'plastic', usageDate: '2026-07-11', quantityUsed: 20, unit: 'kg', wastageQuantity: 0, remarks: null },

  // Jul 12
  { id: 'du-007', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', materialCategory: 'steel', usageDate: '2026-07-12', quantityUsed: 38, unit: 'kg', wastageQuantity: 1, remarks: null },
  { id: 'du-008', employeeId: 'emp-004', employeeName: 'Diego Alvarez', materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', materialCategory: 'aluminum', usageDate: '2026-07-12', quantityUsed: 24, unit: 'kg', wastageQuantity: 0, remarks: null },
  { id: 'du-009', employeeId: 'emp-008', employeeName: 'Omar Farooq', materialId: 'mat-003', materialName: 'PP Granules', materialCategory: 'plastic', usageDate: '2026-07-12', quantityUsed: 22, unit: 'kg', wastageQuantity: 0.5, remarks: null },

  // Jul 13
  { id: 'du-010', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', materialCategory: 'steel', usageDate: '2026-07-13', quantityUsed: 60, unit: 'kg', wastageQuantity: 2, remarks: null },
  { id: 'du-011', employeeId: 'emp-004', employeeName: 'Diego Alvarez', materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', materialCategory: 'aluminum', usageDate: '2026-07-13', quantityUsed: 30, unit: 'kg', wastageQuantity: 1, remarks: null },
  { id: 'du-012', employeeId: 'emp-008', employeeName: 'Omar Farooq', materialId: 'mat-003', materialName: 'PP Granules', materialCategory: 'plastic', usageDate: '2026-07-13', quantityUsed: 25, unit: 'kg', wastageQuantity: 0, remarks: null },

  // Jul 14
  { id: 'du-013', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', materialCategory: 'steel', usageDate: '2026-07-14', quantityUsed: 48, unit: 'kg', wastageQuantity: 1, remarks: null },
  { id: 'du-014', employeeId: 'emp-004', employeeName: 'Diego Alvarez', materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', materialCategory: 'aluminum', usageDate: '2026-07-14', quantityUsed: 26, unit: 'kg', wastageQuantity: 0, remarks: null },
  { id: 'du-015', employeeId: 'emp-008', employeeName: 'Omar Farooq', materialId: 'mat-003', materialName: 'PP Granules', materialCategory: 'plastic', usageDate: '2026-07-14', quantityUsed: 19, unit: 'kg', wastageQuantity: 0.5, remarks: null },

  // Jul 15
  { id: 'du-016', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', materialCategory: 'steel', usageDate: '2026-07-15', quantityUsed: 55, unit: 'kg', wastageQuantity: 2, remarks: null },
  { id: 'du-017', employeeId: 'emp-004', employeeName: 'Diego Alvarez', materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', materialCategory: 'aluminum', usageDate: '2026-07-15', quantityUsed: 32, unit: 'kg', wastageQuantity: 1, remarks: null },
  { id: 'du-018', employeeId: 'emp-008', employeeName: 'Omar Farooq', materialId: 'mat-003', materialName: 'PP Granules', materialCategory: 'plastic', usageDate: '2026-07-15', quantityUsed: 24, unit: 'kg', wastageQuantity: 0, remarks: null },

  // Jul 16
  { id: 'du-019', employeeId: 'emp-006', employeeName: 'Kenji Watanabe', materialId: 'mat-001', materialName: 'Cold Rolled Steel Sheet', materialCategory: 'steel', usageDate: '2026-07-16', quantityUsed: 42, unit: 'kg', wastageQuantity: 1, remarks: null },
  { id: 'du-020', employeeId: 'emp-004', employeeName: 'Diego Alvarez', materialId: 'mat-002', materialName: 'Aluminum Rods 12mm', materialCategory: 'aluminum', usageDate: '2026-07-16', quantityUsed: 20, unit: 'kg', wastageQuantity: 0, remarks: null },
  { id: 'du-021', employeeId: 'emp-008', employeeName: 'Omar Farooq', materialId: 'mat-003', materialName: 'PP Granules', materialCategory: 'plastic', usageDate: '2026-07-16', quantityUsed: 17, unit: 'kg', wastageQuantity: 0.5, remarks: null },
];