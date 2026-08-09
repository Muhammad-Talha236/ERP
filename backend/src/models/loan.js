    import { pool } from '../config/database.js';

const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    employeeId: row.employee_id,
    employeeName: row.employee_name || null,
    loanAmount: parseFloat(row.loan_amount),
    installmentAmount: parseFloat(row.installment_amount),
    startDate: row.start_date,
    durationMonths: row.duration_months,
    amountPaid: parseFloat(row.amount_paid || 0),
    remainingBalance: parseFloat(row.remaining_balance),
    status: row.status,
    reason: row.reason,
    createdAt: row.created_at,
  };
};

export const Loan = {
  create: async (data, tenantId) => {
    const { employeeId, loanAmount, installmentAmount, startDate, durationMonths, reason } = data;
    const query = `
      INSERT INTO employee_loans
        (tenant_id, employee_id, loan_amount, installment_amount, start_date, duration_months, remaining_balance, reason, status)
      VALUES ($1,$2,$3,$4,$5,$6,$3,$7,'Active')
      RETURNING *
    `;
    const values = [
      tenantId,
      employeeId,
      loanAmount,
      installmentAmount,
      startDate,
      durationMonths || 1,
      reason || null,
    ];
    const result = await pool.query(query, values);
    return mapRow(result.rows[0]);
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { employeeId, status } = filters;
    let query = `
      SELECT l.*, e.first_name || ' ' || e.last_name AS employee_name
      FROM employee_loans l
      JOIN employees e ON e.id = l.employee_id
      WHERE l.tenant_id = $1
    `;
    const values = [tenantId];
    let i = 2;
    if (employeeId) { query += ` AND l.employee_id = $${i}`; values.push(employeeId); i++; }
    if (status) { query += ` AND l.status = $${i}`; values.push(status); i++; }
    query += ' ORDER BY l.start_date DESC, l.created_at DESC';
    const result = await pool.query(query, values);
    return result.rows.map(mapRow);
  },

  findById: async (id, tenantId) => {
    const result = await pool.query(
      `SELECT l.*, e.first_name || ' ' || e.last_name AS employee_name
       FROM employee_loans l JOIN employees e ON e.id = l.employee_id
       WHERE l.id = $1 AND l.tenant_id = $2`,
      [id, tenantId]
    );
    return mapRow(result.rows[0]);
  },

  findActiveByEmployee: async (employeeId, tenantId, client = pool) => {
    const result = await client.query(
      `SELECT * FROM employee_loans
       WHERE employee_id = $1 AND tenant_id = $2 AND status = 'Active'
       ORDER BY start_date ASC`,
      [employeeId, tenantId]
    );
    return result.rows.map(mapRow);
  },

  applyRecovery: async (loanId, recoveredAmount, client = pool) => {
    const loanRes = await client.query('SELECT * FROM employee_loans WHERE id = $1 FOR UPDATE', [loanId]);
    const loan = loanRes.rows[0];
    if (!loan) return null;

    const newPaid = parseFloat(loan.amount_paid) + Number(recoveredAmount);
    const newRemaining = Math.max(0, parseFloat(loan.loan_amount) - newPaid);
    const newStatus = newRemaining <= 0 ? 'Completed' : 'Active';

    const result = await client.query(
      `UPDATE employee_loans
       SET amount_paid = $1, remaining_balance = $2, status = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [newPaid, newRemaining, newStatus, loanId]
    );
    return mapRow(result.rows[0]);
  },
};