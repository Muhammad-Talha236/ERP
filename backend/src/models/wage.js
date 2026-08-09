import { pool } from '../config/database.js';
import { Advance } from './advance.js';
import { Loan } from './loan.js';

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
    status: row.status,
    grossAmount: row.gross_amount !== null ? parseFloat(row.gross_amount) : 0,
    overtimeAmount: row.overtime_amount !== null ? parseFloat(row.overtime_amount) : 0,
    allowances: row.allowances !== null ? parseFloat(row.allowances) : 0,
    bonuses: row.bonuses !== null ? parseFloat(row.bonuses) : 0,
    otherEarnings: row.other_earnings !== null ? parseFloat(row.other_earnings) : 0,
    deductions: row.deductions !== null ? parseFloat(row.deductions) : 0,
    advanceDeduction: row.advance_deduction !== null ? parseFloat(row.advance_deduction) : 0,
    loanDeduction: row.loan_deduction !== null ? parseFloat(row.loan_deduction) : 0,
    absenceDeduction: row.absence_deduction !== null ? parseFloat(row.absence_deduction) : 0,
    otherDeductions: row.other_deductions !== null ? parseFloat(row.other_deductions) : 0,
    netAmount: row.net_amount !== null ? parseFloat(row.net_amount) : 0,
    amountPaid: row.amount_paid !== null ? parseFloat(row.amount_paid) : 0,
    paymentStatus: row.payment_status,
    paymentDate: row.payment_date,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference,
    workingDays: row.working_days,
    presentDays: row.present_days,
    absentDays: row.absent_days,
    leaveDays: row.leave_days,
    overtimeHours: row.overtime_hours !== null ? parseFloat(row.overtime_hours) : 0,
    lateHours: row.late_hours !== null ? parseFloat(row.late_hours) : 0,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    notes: row.notes,
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
         amount_paid, payment_status, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,'Pending','Draft')
      RETURNING *
    `;
    const values = [tenantId, employeeId, payPeriodStart, payPeriodEnd, gross, ot, ded, netAmount];
    const result = await pool.query(query, values);
    return mapWageRow(result.rows[0]);
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { employeeId, status, payrollStatus, month, year } = filters;
    let query = `
      SELECT w.*, e.first_name || ' ' || e.last_name AS employee_name, e.department
      FROM wages w
      JOIN employees e ON e.id = w.employee_id
      WHERE w.tenant_id = $1
    `;
    const values = [tenantId];
    let i = 2;

    if (employeeId) { query += ` AND w.employee_id = $${i}`; values.push(employeeId); i++; }
    if (status && status.toLowerCase() !== 'all') { query += ` AND w.payment_status = $${i}`; values.push(status); i++; }
    if (payrollStatus && payrollStatus.toLowerCase() !== 'all') { query += ` AND w.status = $${i}`; values.push(payrollStatus); i++; }
    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM w.pay_period_start) = $${i} AND EXTRACT(YEAR FROM w.pay_period_start) = $${i + 1}`;
      values.push(month, year);
      i += 2;
    }

    query += ' ORDER BY w.pay_period_start DESC, w.created_at DESC';
    const result = await pool.query(query, values);
    return result.rows.map(mapWageRow);
  },

  /**
   * findOverviewByTenant — LEFT JOINs every active employee against
   * their wage record (if any) for the given month/year, so the
   * payroll page can always show every employee's base salary and
   * a "Not Generated" status instead of just the wage rows that
   * happen to already exist.
   */
  findOverviewByTenant: async (tenantId, { month, year } = {}) => {
    const now = new Date();
    const m = Number(month) || now.getMonth() + 1;
    const y = Number(year) || now.getFullYear();

    const query = `
      SELECT
        e.id AS employee_id,
        e.first_name, e.last_name, e.department, e.salary_type,
        e.base_salary,
        w.id AS wage_id,
        w.status,
        w.gross_amount, w.overtime_amount, w.deductions, w.net_amount,
        w.amount_paid, w.payment_status,
        w.pay_period_start, w.pay_period_end
      FROM employees e
      LEFT JOIN wages w
        ON w.employee_id = e.id
        AND w.tenant_id = e.tenant_id
        AND EXTRACT(MONTH FROM w.pay_period_start) = $2
        AND EXTRACT(YEAR FROM w.pay_period_start) = $3
      WHERE e.tenant_id = $1 AND e.status != 'Inactive'
      ORDER BY e.first_name, e.last_name
    `;
    const result = await pool.query(query, [tenantId, m, y]);

    return result.rows.map((row) => ({
      employeeId: row.employee_id,
      employeeName: `${row.first_name} ${row.last_name}`,
      department: row.department,
      salaryType: row.salary_type,
      baseSalary: parseFloat(row.base_salary || 0),
      wageId: row.wage_id,
      status: row.status || 'Not Generated',
      grossAmount: row.gross_amount !== null ? parseFloat(row.gross_amount) : 0,
      overtimeAmount: row.overtime_amount !== null ? parseFloat(row.overtime_amount) : 0,
      deductions: row.deductions !== null ? parseFloat(row.deductions) : 0,
      netAmount: row.net_amount !== null ? parseFloat(row.net_amount) : 0,
      amountPaid: row.amount_paid !== null ? parseFloat(row.amount_paid) : 0,
      paymentStatus: row.payment_status || 'Pending',
      payPeriodStart: row.pay_period_start,
      payPeriodEnd: row.pay_period_end,
    }));
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

  /**
   * generatePayroll — the core Attendance → Earnings → Deductions →
   * Net Payable pipeline. One employee, one pay period.
   *
   * Overtime hours are pulled from Attendance for this period exactly
   * as recorded — the caller only supplies `overtimeRate` ($/hour);
   * overtimeAmount = overtimeHours * overtimeRate. No separate
   * "1.5x hourly rate" auto-calc anymore — the admin controls the
   * rate directly, as requested.
   *
   * Prevents duplicates: if a wage record already exists for this
   * employee/period and its status has moved past 'Draft'/'Calculated',
   * generation is refused (recompute Draft/Calculated ones freely).
   */
  generatePayroll: async (tenantId, { employeeId, payPeriodStart, payPeriodEnd, allowances, bonuses, otherEarnings, otherDeductions, overtimeRate, notes }) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const empRes = await client.query(
        'SELECT * FROM employees WHERE id = $1 AND tenant_id = $2',
        [employeeId, tenantId]
      );
      const employee = empRes.rows[0];
      if (!employee) throw new Error('Employee not found.');

      const existingRes = await client.query(
        `SELECT * FROM wages WHERE employee_id = $1 AND pay_period_start = $2 AND pay_period_end = $3 FOR UPDATE`,
        [employeeId, payPeriodStart, payPeriodEnd]
      );
      const existing = existingRes.rows[0];
      if (existing && !['Draft', 'Calculated'].includes(existing.status)) {
        throw new Error(`Payroll for this period is already ${existing.status.toLowerCase()} — it cannot be regenerated.`);
      }

      // --- Attendance-based working data ---
      const attRes = await client.query(
        `SELECT status, overtime_hours FROM attendance
         WHERE employee_id = $1 AND tenant_id = $2
           AND attendance_date BETWEEN $3 AND $4`,
        [employeeId, tenantId, payPeriodStart, payPeriodEnd]
      );
      const records = attRes.rows;

      const presentDays = records.filter((r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Half Day').length;
      const absentDays = records.filter((r) => r.status === 'Absent').length;
      const leaveDays = records.filter((r) => r.status === 'Leave').length;
      const lateDays = records.filter((r) => r.status === 'Late').length;
      const overtimeHours = records.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0);
      const workingDays = records.length || (presentDays + absentDays + leaveDays);

      // --- Earnings ---
      const baseSalary = parseFloat(employee.base_salary || 0);
      const salaryType = employee.salary_type;

      let basicPay = 0;
      if (salaryType === 'Monthly') {
        basicPay = baseSalary;
      } else if (salaryType === 'Daily') {
        basicPay = baseSalary * presentDays;
      } else {
        basicPay = 0; // Piece Rate handled elsewhere
      }

      const dailyRate = workingDays > 0 ? baseSalary / workingDays : 0;

      // Overtime: hours from attendance x admin-set $/hour rate. Simple,
      // predictable, and fully under the admin's control.
      const overtimeRateAmt = Number(overtimeRate || 0);
      const overtimeAmount = Number((overtimeHours * overtimeRateAmt).toFixed(2));

      const allowancesAmt = Number(allowances || 0);
      const bonusesAmt = Number(bonuses || 0);
      const otherEarningsAmt = Number(otherEarnings || 0);

      const grossAmount = Number((basicPay + overtimeAmount + allowancesAmt + bonusesAmt + otherEarningsAmt).toFixed(2));

      // --- Deductions ---
      const absenceDeduction = salaryType === 'Monthly' ? Number((dailyRate * absentDays).toFixed(2)) : 0;

      const pendingAdvances = await Advance.findPendingByEmployee(employeeId, tenantId, client);
      let advanceDeduction = 0;
      const deductionEntries = [];

      pendingAdvances.forEach((adv) => {
        const remaining = adv.remainingBalance;
        if (remaining <= 0) return;
        const due = adv.recoveryType === 'Full' ? remaining : Math.min(adv.installmentAmount, remaining);
        if (due > 0) {
          advanceDeduction += due;
          deductionEntries.push({ type: 'Advance', referenceId: adv.id, amount: due, reason: `Advance recovery (${adv.reason || 'advance'})` });
        }
      });

      const activeLoans = await Loan.findActiveByEmployee(employeeId, tenantId, client);
      let loanDeduction = 0;
      activeLoans.forEach((loan) => {
        const remaining = loan.remainingBalance;
        if (remaining <= 0) return;
        const due = Math.min(loan.installmentAmount, remaining);
        if (due > 0) {
          loanDeduction += due;
          deductionEntries.push({ type: 'Loan', referenceId: loan.id, amount: due, reason: `Loan installment (${loan.reason || 'loan'})` });
        }
      });

      if (absenceDeduction > 0) {
        deductionEntries.push({ type: 'Absence', referenceId: null, amount: absenceDeduction, reason: `${absentDays} absent day(s)` });
      }

      const otherDeductionsAmt = Number(otherDeductions || 0);
      if (otherDeductionsAmt > 0) {
        deductionEntries.push({ type: 'Other', referenceId: null, amount: otherDeductionsAmt, reason: notes || 'Other deduction' });
      }

      advanceDeduction = Number(advanceDeduction.toFixed(2));
      loanDeduction = Number(loanDeduction.toFixed(2));

      const totalDeductions = Number((advanceDeduction + loanDeduction + absenceDeduction + otherDeductionsAmt).toFixed(2));
      const netAmount = Number((grossAmount - totalDeductions).toFixed(2));

      let wageRow;
      if (existing) {
        await client.query('DELETE FROM wage_deductions WHERE wage_id = $1', [existing.id]);
        const updateRes = await client.query(
          `UPDATE wages SET
             status = 'Calculated',
             gross_amount = $1, overtime_amount = $2, allowances = $3, bonuses = $4, other_earnings = $5,
             deductions = $6, advance_deduction = $7, loan_deduction = $8, absence_deduction = $9, other_deductions = $10,
             net_amount = $11, working_days = $12, present_days = $13, absent_days = $14, leave_days = $15,
             overtime_hours = $16, late_hours = $17, notes = COALESCE($18, notes), updated_at = CURRENT_TIMESTAMP
           WHERE id = $19
           RETURNING *`,
          [grossAmount, overtimeAmount, allowancesAmt, bonusesAmt, otherEarningsAmt,
           totalDeductions, advanceDeduction, loanDeduction, absenceDeduction, otherDeductionsAmt,
           netAmount, workingDays, presentDays, absentDays, leaveDays,
           overtimeHours, lateDays, notes, existing.id]
        );
        wageRow = updateRes.rows[0];
      } else {
        const insertRes = await client.query(
          `INSERT INTO wages
             (tenant_id, employee_id, pay_period_start, pay_period_end, status,
              gross_amount, overtime_amount, allowances, bonuses, other_earnings,
              deductions, advance_deduction, loan_deduction, absence_deduction, other_deductions,
              net_amount, amount_paid, payment_status,
              working_days, present_days, absent_days, leave_days, overtime_hours, late_hours, notes)
           VALUES ($1,$2,$3,$4,'Calculated',
              $5,$6,$7,$8,$9,
              $10,$11,$12,$13,$14,
              $15,0,'Pending',
              $16,$17,$18,$19,$20,$21,$22)
           RETURNING *`,
          [tenantId, employeeId, payPeriodStart, payPeriodEnd,
           grossAmount, overtimeAmount, allowancesAmt, bonusesAmt, otherEarningsAmt,
           totalDeductions, advanceDeduction, loanDeduction, absenceDeduction, otherDeductionsAmt,
           netAmount,
           workingDays, presentDays, absentDays, leaveDays, overtimeHours, lateDays, notes || null]
        );
        wageRow = insertRes.rows[0];
      }

      for (const entry of deductionEntries) {
        await client.query(
          `INSERT INTO wage_deductions (wage_id, type, reference_id, amount, reason) VALUES ($1,$2,$3,$4,$5)`,
          [wageRow.id, entry.type, entry.referenceId, entry.amount, entry.reason]
        );
      }

      await client.query('COMMIT');
      return { ...mapWageRow(wageRow), employeeName: `${employee.first_name} ${employee.last_name}`, department: employee.department };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  approve: async (id, tenantId, approvedByUserId) => {
    const result = await pool.query(
      `UPDATE wages SET status = 'Approved', approved_by = $1, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND tenant_id = $3 AND status = 'Calculated'
       RETURNING *`,
      [approvedByUserId, id, tenantId]
    );
    if (result.rows.length === 0) {
      throw new Error('Only a Calculated payroll can be approved.');
    }
    return mapWageRow(result.rows[0]);
  },

  fetchDeductionBreakdown: async (wageId) => {
    const result = await pool.query('SELECT * FROM wage_deductions WHERE wage_id = $1 ORDER BY id', [wageId]);
    return result.rows;
  },

  recordPayment: async (wageId, tenantId, { amount, type, remarks, paymentMethod, paymentReference }) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const wageRes = await client.query(
        'SELECT * FROM wages WHERE id = $1 AND tenant_id = $2 FOR UPDATE',
        [wageId, tenantId]
      );
      const wage = wageRes.rows[0];
      if (!wage) throw new Error('Wage record not found.');
      if (!['Approved', 'Paid'].includes(wage.status)) {
        throw new Error('Payroll must be Approved before it can be paid.');
      }

      const netAmount = parseFloat(wage.net_amount);
      const currentPaid = parseFloat(wage.amount_paid);
      const remaining = netAmount - currentPaid;

      if (Number(amount) > remaining) {
        throw new Error(`Payment amount cannot exceed the remaining balance of ${remaining}.`);
      }

      const newAmountPaid = currentPaid + Number(amount);
      const newPaymentStatus = deriveStatus(newAmountPaid, netAmount);
      const nowFullyPaid = newPaymentStatus === 'Paid';

      const updatedWageRes = await client.query(
        `UPDATE wages
         SET amount_paid = $1, payment_status = $2, payment_date = CURRENT_DATE,
             payment_method = COALESCE($3, payment_method), payment_reference = COALESCE($4, payment_reference),
             status = CASE WHEN $5 THEN 'Paid' ELSE status END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [newAmountPaid, newPaymentStatus, paymentMethod || null, paymentReference || null, nowFullyPaid, wageId]
      );

      const paymentRes = await client.query(
        `INSERT INTO wage_payments (wage_id, employee_id, payment_type, amount, remarks)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [wageId, wage.employee_id, type, amount, remarks || null]
      );

      if (nowFullyPaid) {
        const deductions = await client.query('SELECT * FROM wage_deductions WHERE wage_id = $1', [wageId]);
        for (const d of deductions.rows) {
          if (d.type === 'Advance' && d.reference_id) {
            await Advance.applyRecovery(d.reference_id, d.amount, client);
          } else if (d.type === 'Loan' && d.reference_id) {
            await Loan.applyRecovery(d.reference_id, d.amount, client);
          }
        }
      }

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