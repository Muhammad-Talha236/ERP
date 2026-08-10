import { pool } from '../config/database.js';

/**
 * formatLocalDate — converts a pg DATE value into a 'YYYY-MM-DD'
 * string using LOCAL date parts (getFullYear/getMonth/getDate),
 * never toISOString().
 *
 * WHY THIS MATTERS (the bug this fixes):
 * node-postgres's default type parser for a DATE column builds the
 * JS Date object as `new Date(year, month, day)` — i.e. midnight in
 * the SERVER's LOCAL timezone. When Express later serializes that
 * Date via res.json(), JSON.stringify() calls Date.prototype.toJSON()
 * -> toISOString(), which converts to UTC. For any timezone AHEAD of
 * UTC (e.g. Pakistan, UTC+5), local midnight is still the PREVIOUS
 * day in UTC — so the date silently shifts back by one day by the
 * time it reaches the frontend. That's exactly the "chart is one day
 * behind" bug (compare: today = Aug 10 data shows up as Aug 9).
 *
 * Fix: read the date back out using LOCAL getters, which reverses
 * the same local-timezone construction pg-types used, so the
 * calendar date sent to the frontend always matches what's actually
 * stored in the database — regardless of server timezone.
 */
function formatLocalDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * mapRow — normalizes a daily_usage row (+ joined material columns)
 * into the shape the frontend expects, with the date bug fixed.
 */
const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    materialId: row.material_id,
    materialName: row.material_name || 'Unknown Material',
    materialCode: row.material_code || 'N/A',
    quantityUsed: parseFloat(row.quantity_used),
    unit: row.unit || 'units',
    usageDate: formatLocalDate(row.usage_date),
    remarks: row.remarks,
    recordedBy: row.recorded_by,
  };
};

export const DailyUsage = {
  findByTenant: async (tenantId) => {
    const tIdStr = String(tenantId);
    const tIdInt = parseInt(tenantId, 10) || 1;

    // Strictly filter by tenant_id so every admin only sees their own data
    const result = await pool.query(
      `SELECT du.*, COALESCE(m.material_name, 'Unknown Material') AS material_name, COALESCE(m.material_code, 'N/A') AS material_code, COALESCE(m.unit, 'units') AS unit 
       FROM daily_usage du
       LEFT JOIN materials m ON du.material_id::integer = m.id
       WHERE du.tenant_id = $1 OR du.tenant_id = $2
       ORDER BY du.usage_date DESC, du.created_at DESC`,
      [tIdStr, String(tIdInt)]
    );
    return result.rows.map(mapRow);
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

      // usageDate comes straight from the frontend's <input type="date">
      // (a plain 'YYYY-MM-DD' string), so it's stored exactly as chosen —
      // no timezone math happens on the way IN. The bug was only on the
      // way OUT (see formatLocalDate above). If no date was supplied at
      // all, fall back to today's date using LOCAL parts, not
      // toISOString(), so the fallback can't be off by a day either.
      const fallbackToday = formatLocalDate(new Date());

      const insertRes = await client.query(
        `INSERT INTO daily_usage (tenant_id, material_id, quantity_used, usage_date, remarks, recorded_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [tIdStr, matId, qty, usageDate || fallbackToday, remarks || null, recordedBy || 'System']
      );

      await client.query(
        `UPDATE materials 
         SET current_stock = current_stock - $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [qty, matId]
      );

      await client.query('COMMIT');

      // Re-fetch with the material join so the returned shape matches
      // findByTenant exactly (material name/code/unit included).
      const fullRow = await pool.query(
        `SELECT du.*, COALESCE(m.material_name, 'Unknown Material') AS material_name, COALESCE(m.material_code, 'N/A') AS material_code, COALESCE(m.unit, 'units') AS unit
         FROM daily_usage du
         LEFT JOIN materials m ON du.material_id::integer = m.id
         WHERE du.id = $1`,
        [insertRes.rows[0].id]
      );

      return mapRow(fullRow.rows[0]);
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

      const fullRow = await pool.query(
        `SELECT du.*, COALESCE(m.material_name, 'Unknown Material') AS material_name, COALESCE(m.material_code, 'N/A') AS material_code, COALESCE(m.unit, 'units') AS unit
         FROM daily_usage du
         LEFT JOIN materials m ON du.material_id::integer = m.id
         WHERE du.id = $1`,
        [updateRes.rows[0].id]
      );

      return mapRow(fullRow.rows[0]);
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