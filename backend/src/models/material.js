import { pool } from '../config/database.js';

const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    materialCode: row.material_code,
    materialName: row.material_name,
    category: row.category,
    unit: row.unit,
    currentStock: row.current_stock !== null ? parseFloat(row.current_stock) : 0,
    minimumStock: row.minimum_stock !== null ? parseFloat(row.minimum_stock) : 0,
    purchasePrice: row.purchase_price !== null ? parseFloat(row.purchase_price) : 0,
    status: row.status,
    supplierName: row.supplier_name,
    lastUpdated: row.updated_at || row.created_at,
    createdAt: row.created_at,
  };
};

export const Material = {
  create: async (data, tenantId) => {
    const {
      materialCode, materialName, category, unit,
      currentStock, minimumStock, purchasePrice, supplierName, status,
    } = data;

    const query = `
      INSERT INTO materials
        (tenant_id, material_code, material_name, category, unit,
         current_stock, minimum_stock, purchase_price, supplier_name, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;
    const values = [
      tenantId, materialCode, materialName, category, unit,
      currentStock || 0, minimumStock || 0, purchasePrice || 0,
      supplierName || null, status || 'Active',
    ];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { search, stock } = filters;
    let query = `SELECT * FROM materials WHERE tenant_id = $1`;
    const values = [tenantId];
    let i = 2;

    if (search && search.trim() !== '') {
      query += ` AND (material_name ILIKE $${i} OR material_code ILIKE $${i})`;
      values.push(`%${search}%`);
      i++;
    }
    if (stock === 'low') {
      query += ` AND current_stock < minimum_stock`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, values);
    return result.rows.map(mapRow);
  },

  findById: async (id, tenantId) => {
    const result = await pool.query(
      'SELECT * FROM materials WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    return mapRow(result.rows[0]);
  },

  update: async (id, tenantId, updates) => {
    const {
      materialCode, materialName, category, unit,
      currentStock, minimumStock, purchasePrice, supplierName, status,
    } = updates;

    const query = `
      UPDATE materials
      SET material_code = COALESCE($1, material_code),
          material_name = COALESCE($2, material_name),
          category = COALESCE($3, category),
          unit = COALESCE($4, unit),
          current_stock = COALESCE($5, current_stock),
          minimum_stock = COALESCE($6, minimum_stock),
          purchase_price = COALESCE($7, purchase_price),
          supplier_name = COALESCE($8, supplier_name),
          status = COALESCE($9, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 AND tenant_id = $11
      RETURNING *
    `;
    const values = [
      materialCode, materialName, category, unit,
      currentStock, minimumStock, purchasePrice, supplierName, status,
      id, tenantId,
    ];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  },

  // Called by purchaseOrder.js when a PO is marked Received, and by
  // daily-usage handlers when stock is consumed (delta can be +/-).
  adjustStock: async (id, tenantId, delta) => {
    const result = await pool.query(
      `UPDATE materials
       SET current_stock = GREATEST(0, current_stock + $1), updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND tenant_id = $3
       RETURNING *`,
      [delta, id, tenantId]
    );
    return mapRow(result.rows[0]);
  },

  delete: async (id, tenantId) => {
    const result = await pool.query(
      'DELETE FROM materials WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [id, tenantId]
    );
    return result.rows[0];
  },
};