import { pool } from '../config/database.js';

export const DailyUsage = {
 findByTenant: async (tenantId) => {
    const tIdStr = String(tenantId);
    const tIdInt = parseInt(tenantId, 10) || 1;

    // Yahan ab tenant_id ke mutabiq strictly filter ho raha hai taaki har admin ko sirf apna data dikhe
    const result = await pool.query(
      `SELECT du.*, COALESCE(m.material_name, 'Unknown Material') AS material_name, COALESCE(m.material_code, 'N/A') AS material_code, COALESCE(m.unit, 'units') AS unit 
       FROM daily_usage du
       LEFT JOIN materials m ON du.material_id::integer = m.id
       WHERE du.tenant_id = $1 OR du.tenant_id = $2
       ORDER BY du.usage_date DESC, du.created_at DESC`,
      [tIdStr, String(tIdInt)]
    );
    return result.rows.map((r) => ({
      id: r.id,
      tenantId: r.tenant_id,
      materialId: r.material_id,
      materialName: r.material_name,
      materialCode: r.material_code,
      quantityUsed: parseFloat(r.quantity_used),
      unit: r.unit,
      usageDate: r.usage_date,
      remarks: r.remarks,
      recordedBy: r.recorded_by,
    }));
  },
  create: async (tenantId, data) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { materialId, quantityUsed, usageDate, remarks, recordedBy } = data;
      const qty = parseFloat(quantityUsed);
      const matId = parseInt(materialId, 10);
      const tIdStr = String(tenantId);

      const matRes = await client.query(
        'SELECT current_stock, material_name FROM materials WHERE id = $1 FOR UPDATE',
        [matId]
      );
      
      if (matRes.rows.length === 0) {
        throw new Error(`Material not found with ID: ${matId}`);
      }

      const currentStock = parseFloat(matRes.rows[0].current_stock);
      if (qty > currentStock) {
        throw new Error(`Insufficient stock! Available stock for ${matRes.rows[0].material_name} is only ${currentStock}.`);
      }

      const insertRes = await client.query(
        `INSERT INTO daily_usage (tenant_id, material_id, quantity_used, usage_date, remarks, recorded_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [tIdStr, matId, qty, usageDate || new Date().toISOString().split('T')[0], remarks || null, recordedBy || 'System']
      );

      await client.query(
        `UPDATE materials 
         SET current_stock = current_stock - $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [qty, matId]
      );

      await client.query('COMMIT');
      return insertRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

 update: async (id, tenantId, data) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { quantityUsed, remarks, usageDate } = data;
      const newQty = parseFloat(quantityUsed);
      const oldRes = await client.query('SELECT * FROM daily_usage WHERE id = $1', [id]);
      if (oldRes.rows.length === 0) throw new Error('Daily usage record not found.');
      const oldRecord = oldRes.rows[0];
      const oldQty = parseFloat(oldRecord.quantity_used);
      const matId = oldRecord.material_id;
      const diff = newQty - oldQty;
      if (diff > 0) {
        const matRes = await client.query('SELECT current_stock FROM materials WHERE id = $1 FOR UPDATE', [matId]);
        if (matRes.rows.length > 0 && parseFloat(matRes.rows[0].current_stock) < diff) {
          throw new Error('Insufficient stock for this update.');
        }
      }
      const updateRes = await client.query(
        `UPDATE daily_usage 
          SET quantity_used = $1, remarks = COALESCE($2, remarks), usage_date = COALESCE($3, usage_date)
         WHERE id = $4 RETURNING *`,
        [newQty, remarks, usageDate, id]
      );
      await client.query(
        `UPDATE materials SET current_stock = current_stock - $1 WHERE id = $2`,
        [diff, matId]
      );
      await client.query('COMMIT');
      return updateRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  delete: async (id, tenantId) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const res = await client.query('SELECT * FROM daily_usage WHERE id = $1', [id]);
      if (res.rows.length === 0) throw new Error('Daily usage record not found.');
      const record = res.rows[0];
      const qty = parseFloat(record.quantity_used);
      const matId = record.material_id;

      await client.query('DELETE FROM daily_usage WHERE id = $1', [id]);

      await client.query(
        `UPDATE materials SET current_stock = current_stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [qty, matId]
      );

      await client.query('COMMIT');
      return { id };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};