import { pool } from '../config/database.js';

const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    employeeId: row.employee_id,
    employeeName: row.employee_name || null,
 attendanceDate: row.attendance_date 
  ? (() => {
      const d = new Date(row.attendance_date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })() 
  : null,   status: row.status,
    checkIn: row.check_in,
    checkOut: row.check_out,
    overtimeHours: row.overtime_hours !== null ? parseFloat(row.overtime_hours) : 0,
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const Attendance = {
  // Upsert: dobara mark karo to purana record hi update ho, duplicate na bane.
  create: async (data, tenantId) => {
    const { employeeId, attendanceDate, status, checkIn, checkOut, overtimeHours, remarks } = data;
    const query = `
      INSERT INTO attendance
        (tenant_id, employee_id, attendance_date, status, check_in, check_out, overtime_hours, remarks)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (employee_id, attendance_date)
      DO UPDATE SET
        status = EXCLUDED.status,
        check_in = EXCLUDED.check_in,
        check_out = EXCLUDED.check_out,
        overtime_hours = EXCLUDED.overtime_hours,
        remarks = EXCLUDED.remarks,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [tenantId, Number(employeeId), attendanceDate, status, checkIn || null, checkOut || null, overtimeHours || 0, remarks || null];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { date, employeeId, month, year } = filters;
    let query = `
      SELECT a.*, e.first_name || ' ' || e.last_name AS employee_name
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      WHERE a.tenant_id = $1
    `;
    const values = [tenantId];
    let i = 2;

    if (date) {
      query += ` AND a.attendance_date = $${i}`;
      values.push(date);
      i++;
    }
    if (employeeId) {
      query += ` AND a.employee_id = $${i}`;
      values.push(Number(employeeId));
      i++;
    }
    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM a.attendance_date) = $${i} AND EXTRACT(YEAR FROM a.attendance_date) = $${i + 1}`;
      values.push(month, year);
      i += 2;
    }

    query += ' ORDER BY a.attendance_date DESC';
    const result = await pool.query(query, values);
    return result.rows.map(mapRow);
  },

 update: async (id, tenantId, updates) => {
    const { status, checkIn, checkOut, overtimeHours, remarks } = updates;
    
    // FIX: Agar checkIn ya checkOut empty string ho, toh unhe null bana do taake PostgreSQL time error na de
    const formattedCheckIn = checkIn && checkIn.trim() !== '' ? checkIn : null;
    const formattedCheckOut = checkOut && checkOut.trim() !== '' ? checkOut : null;

    const query = `
      UPDATE attendance
      SET status = COALESCE($1, status),
          check_in = COALESCE($2, check_in),
          check_out = COALESCE($3, check_out),
          overtime_hours = COALESCE($4, overtime_hours),
          remarks = COALESCE($5, remarks),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND tenant_id = $7
      RETURNING *
    `;
    const values = [status, formattedCheckIn, formattedCheckOut, overtimeHours, remarks, id, tenantId];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  },
};