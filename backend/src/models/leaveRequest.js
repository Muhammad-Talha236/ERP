import { pool } from '../config/database.js';

const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    employeeId: row.employee_id,
    employeeName: row.employee_name || null,
    type: row.leave_type,
    // FIX: UTC ki bajaye local date string strict slice karein taake date change na ho
    fromDate: row.from_date ? new Date(row.from_date).toLocaleDateString('en-CA') : null,
    toDate: row.to_date ? new Date(row.to_date).toLocaleDateString('en-CA') : null,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at,
  };
};

export const LeaveRequest = {
  create: async (data, tenantId) => {
    const { employeeId, leaveType, fromDate, toDate, reason } = data;
    const query = `
      INSERT INTO leave_requests (tenant_id, employee_id, leave_type, from_date, to_date, reason)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [tenantId, Number(employeeId), leaveType, fromDate, toDate, reason || null]);
    return mapRow(result.rows[0]);
  },

  findByTenant: async (tenantId) => {
    const query = `
      SELECT l.*, e.first_name || ' ' || e.last_name AS employee_name
      FROM leave_requests l
      JOIN employees e ON e.id = l.employee_id
      WHERE l.tenant_id = $1
      ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query, [tenantId]);
    return result.rows.map(mapRow);
  },

  updateStatus: async (id, tenantId, status) => {
    const query = `
      UPDATE leave_requests
      SET status = COALESCE($1, status), updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND tenant_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, id, tenantId]);
    return mapRow(result.rows[0]);
  },
update: async (id, tenantId, data) => {
    const { leaveType, fromDate, toDate, reason, status } = data;
    const query = `
      UPDATE leave_requests
      SET leave_type = COALESCE($1, leave_type),
          from_date = COALESCE($2, from_date),
          to_date = COALESCE($3, to_date),
          reason = COALESCE($4, reason),
          status = COALESCE($5, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND tenant_id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [leaveType, fromDate, toDate, reason, status || 'Pending', id, tenantId]);
    return mapRow(result.rows[0]);
  },
};