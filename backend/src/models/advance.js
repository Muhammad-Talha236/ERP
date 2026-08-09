import { pool } from '../config/database.js';

const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    employeeId: row.employee_id,
    employeeName: row.employee_name || null,
    amount: parseFloat(row.amount),
    advanceDate: row.advance_date,
    reason: row.reason,
    recoveryType: row.recovery_type,
    installmentAmount: parseFloat(row.installment_amount || 0),
    amountRecovered: parseFloat(row.amount_recovered || 0),
    remainingBalance: parseFloat(row.amount) - parseFloat(row.amount_recovered || 0),
    status: row.status,
    createdAt: row.created_at,
  };
};

export const Advance = {
  create: async (data, tenantId) => {
    const { employeeId, amount, advanceDate, reason, recoveryType, installmentAmount } = data;
    const query = `
      INSERT INTO employee_advances
        (tenant_id, employee_id, amount, advance_date, reason, recovery_type, installment_amount, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'Pending')
      RETURNING *
    `;
    const values = [
      tenantId,
      employeeId,
      amount,
      advanceDate || new Date().toISOString().slice(0, 10),
      reason || null,
      recoveryType || 'Full',
      recoveryType === 'Installment' ? Number(installmentAmount || 0) : Number(amount),
    ];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { employeeId, status } = filters;
    let query = `
      SELECT a.*, e.first_name || ' ' || e.last_name AS employee_name
      FROM employee_advances a
      JOIN employees e ON e.id = a.employee_id
      WHERE a.tenant_id = $1
    `;
    const values = [tenantId];
    let i = 2;
    if (employeeId) { query += ` AND a.employee_id = $${i}`; values.push(employeeId); i++; }
    if (status) { query += ` AND a.status = $${i}`; values.push(status); i++; }
    query += ' ORDER BY a.advance_date DESC, a.created_at DESC';
    const result = await pool.query(query, values);
    return result.rows.map(mapRow);
  },

  findById: async (id, tenantId) => {
    const result = await pool.query(
      `SELECT a.*, e.first_name || ' ' || e.last_name AS employee_name
       FROM employee_advances a JOIN employees e ON e.id = a.employee_id
       WHERE a.id = $1 AND a.tenant_id = $2`,
      [id, tenantId]
    );
    return mapRow(result.rows[0]);
  },

  /** Pending advances for an employee, used by payroll generation. */
  findPendingByEmployee: async (employeeId, tenantId, client = pool) => {
    const result = await client.query(
      `SELECT * FROM employee_advances
       WHERE employee_id = $1 AND tenant_id = $2 AND status IN ('Pending','Recovering')
       ORDER BY advance_date ASC`,
      [employeeId, tenantId]
    );
    return result.rows.map(mapRow);
  },

  /** Applies actual recovery once a payslip is fully paid. */
  applyRecovery: async (advanceId, recoveredAmount, client = pool) => {
    const advRes = await client.query('SELECT * FROM employee_advances WHERE id = $1 FOR UPDATE', [advanceId]);
    const advance = advRes.rows[0];
    if (!advance) return null;

    const newRecovered = parseFloat(advance.amount_recovered) + Number(recoveredAmount);
    const newStatus = newRecovered >= parseFloat(advance.amount) ? 'Completed' : 'Recovering';

    const result = await client.query(
      `UPDATE employee_advances
       SET amount_recovered = $1, status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [newRecovered, newStatus, advanceId]
    );
    return mapRow(result.rows[0]);
  },
};