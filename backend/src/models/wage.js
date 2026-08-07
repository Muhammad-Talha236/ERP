import { pool } from '../config/database.js';

const mapWageRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    employeeId: row.employee_id,
    employeeName: row.employee_name || null,
    department: row.department || null,
    payPeriodStart: row.pay_period_start,
    payPeriodEnd: row.pay_period_end,
    grossAmount: row.gross_amount !== null ? parseFloat(row.gross_amount) : 0,
    overtimeAmount: row.overtime_amount !== null ? parseFloat(row.overtime_amount) : 0,
    deductions: row.deductions !== null ? parseFloat(row.deductions) : 0,
    netAmount: row.net_amount !== null ? parseFloat(row.net_amount) : 0,
    amountPaid: row.amount_paid !== null ? parseFloat(row.amount_paid) : 0,
    paymentStatus: row.payment_status,
    paymentDate: row.payment_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const mapPaymentRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    wageId: row.wage_id,
    employeeId: row.employee_id,
    type: row.payment_type,
    amount: row.amount !== null ? parseFloat(row.amount) : 0,
    date: row.payment_date,
    remarks: row.remarks,
    createdAt: row.created_at,
  };
};

function deriveStatus(amountPaid, netAmount) {
  if (amountPaid <= 0) return 'Pending';
  if (amountPaid >= netAmount) return 'Paid';
  return 'Partial';
}

export const Wage = {
  create: async (data, tenantId) => {
    const { employeeId, payPeriodStart, payPeriodEnd, grossAmount, overtimeAmount, deductions } = data;

    const gross = Number(grossAmount || 0);
    const ot = Number(overtimeAmount || 0);
    const ded = Number(deductions || 0);
    const netAmount = gross + ot - ded;

    const query = `
      INSERT INTO wages
        (tenant_id, employee_id, pay_period_start, pay_period_end,
         gross_amount, overtime_amount, deductions, net_amount,
         amount_paid, payment_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,'Pending')
      RETURNING *
    `;
    const values = [tenantId, employeeId, payPeriodStart, payPeriodEnd, gross, ot, ded, netAmount];
    const result = await pool.query(query, values);
    return mapWageRow(result.rows[0]);
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { employeeId, status } = filters;
    let query = `
      SELECT w.*, e.first_name || ' ' || e.last_name AS employee_name, e.department
      FROM wages w
      JOIN employees e ON e.id = w.employee_id
      WHERE w.tenant_id = $1
    `;
    const values = [tenantId];
    let i = 2;

    if (employeeId) {
      query += ` AND w.employee_id = $${i}`;
      values.push(employeeId);
      i++;
    }
    if (status && status.toLowerCase() !== 'all') {
      query += ` AND w.payment_status = $${i}`;
      values.push(status);
      i++;
    }

    query += ' ORDER BY w.created_at DESC';
    const result = await pool.query(query, values);
    return result.rows.map(mapWageRow);
  },

  findById: async (id, tenantId) => {
    const result = await pool.query(
      `SELECT w.*, e.first_name || ' ' || e.last_name AS employee_name, e.department
       FROM wages w JOIN employees e ON e.id = w.employee_id
       WHERE w.id = $1 AND w.tenant_id = $2`,
      [id, tenantId]
    );
    return mapWageRow(result.rows[0]);
  },

  recordPayment: async (wageId, tenantId, { amount, type, remarks }) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const wageRes = await client.query(
        'SELECT * FROM wages WHERE id = $1 AND tenant_id = $2 FOR UPDATE',
        [wageId, tenantId]
      );
      const wage = wageRes.rows[0];
      if (!wage) throw new Error('Wage record not found.');

      const netAmount = parseFloat(wage.net_amount);
      const currentPaid = parseFloat(wage.amount_paid);
      const remaining = netAmount - currentPaid;

      if (Number(amount) > remaining) {
        throw new Error(`Payment amount cannot exceed the remaining balance of ${remaining}.`);
      }

      const newAmountPaid = currentPaid + Number(amount);
      const newStatus = deriveStatus(newAmountPaid, netAmount);

      const updatedWageRes = await client.query(
        `UPDATE wages
         SET amount_paid = $1, payment_status = $2, payment_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [newAmountPaid, newStatus, wageId]
      );

      const paymentRes = await client.query(
        `INSERT INTO wage_payments (wage_id, employee_id, payment_type, amount, remarks)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [wageId, wage.employee_id, type, amount, remarks || null]
      );

      await client.query('COMMIT');
      return { wage: mapWageRow(updatedWageRes.rows[0]), transaction: mapPaymentRow(paymentRes.rows[0]) };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  fetchPaymentHistory: async (wageId) => {
    const result = await pool.query(
      'SELECT * FROM wage_payments WHERE wage_id = $1 ORDER BY payment_date DESC, created_at DESC',
      [wageId]
    );
    return result.rows.map(mapPaymentRow);
  },

  updatePayment: async (transactionId, tenantId, updates) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const txRes = await client.query('SELECT * FROM wage_payments WHERE id = $1 FOR UPDATE', [transactionId]);
      const transaction = txRes.rows[0];
      if (!transaction) throw new Error('Payment record not found.');

      const wageRes = await client.query(
        'SELECT * FROM wages WHERE id = $1 AND tenant_id = $2 FOR UPDATE',
        [transaction.wage_id, tenantId]
      );
      const wage = wageRes.rows[0];
      if (!wage) throw new Error('Wage record not found.');

      const netAmount = parseFloat(wage.net_amount);
      const currentPaid = parseFloat(wage.amount_paid);
      const oldAmount = parseFloat(transaction.amount);
      const newAmount = Number(updates.amount);
      const diff = newAmount - oldAmount;
      const newAmountPaid = currentPaid + diff;

      if (newAmountPaid < 0) throw new Error('This edit would make the total paid amount negative.');
      if (newAmountPaid > netAmount) throw new Error(`This edit would exceed the net payable amount of ${netAmount}.`);

      const newStatus = deriveStatus(newAmountPaid, netAmount);

      await client.query(
        `UPDATE wage_payments SET amount = $1, remarks = COALESCE($2, remarks), payment_type = COALESCE($3, payment_type)
         WHERE id = $4`,
        [newAmount, updates.remarks, updates.type, transactionId]
      );

      const updatedWageRes = await client.query(
        `UPDATE wages SET amount_paid = $1, payment_status = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 RETURNING *`,
        [newAmountPaid, newStatus, wage.id]
      );

      const updatedTxRes = await client.query('SELECT * FROM wage_payments WHERE id = $1', [transactionId]);

      await client.query('COMMIT');
      return { wage: mapWageRow(updatedWageRes.rows[0]), transaction: mapPaymentRow(updatedTxRes.rows[0]) };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};