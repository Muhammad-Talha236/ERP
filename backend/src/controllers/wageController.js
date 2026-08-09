import { Wage } from '../models/wage.js';

export const createWage = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { employeeId, payPeriodStart, payPeriodEnd } = req.body;
    if (!employeeId || !payPeriodStart || !payPeriodEnd) {
      return res.status(400).json({ message: 'employeeId, payPeriodStart and payPeriodEnd are required' });
    }

    const wage = await Wage.create(req.body, tenantId);
    res.status(201).json({ success: true, message: 'Payroll generated successfully', wage });
  } catch (error) {
    console.error('Create wage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generatePayroll = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { employeeId, payPeriodStart, payPeriodEnd, basicPay, allowances, bonuses, otherEarnings, otherDeductions, overtimeRate, notes } = req.body;
    if (!employeeId || !payPeriodStart || !payPeriodEnd) {
      return res.status(400).json({ message: 'employeeId, payPeriodStart and payPeriodEnd are required' });
    }

    const wage = await Wage.generatePayroll(tenantId, {
      employeeId, payPeriodStart, payPeriodEnd, basicPay, allowances, bonuses, otherEarnings, otherDeductions, overtimeRate, notes,
    });

    res.status(201).json({ success: true, message: 'Payroll calculated successfully', wage });
  } catch (error) {
    console.error('Generate payroll error:', error);
    res.status(400).json({ message: error.message || 'Failed to generate payroll' });
  }
};

export const approveWage = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const wage = await Wage.approve(req.params.id, tenantId, req.user.id);
    res.json({ success: true, message: 'Payroll approved', wage });
  } catch (error) {
    console.error('Approve wage error:', error);
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

export const getWageDeductions = async (req, res) => {
  try {
    const breakdown = await Wage.fetchDeductionBreakdown(req.params.id);
    res.json({ success: true, deductions: breakdown });
  } catch (error) {
    console.error('Get wage deductions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWages = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { employeeId, status, payrollStatus, month, year } = req.query;
    const wages = await Wage.findByTenant(tenantId, { employeeId, status, payrollStatus, month, year });
    res.json({ success: true, wages });
  } catch (error) {
    console.error('Get wages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/wages/overview — every active employee for the tenant,
 * joined against their wage record for the given month/year (if any).
 * Powers the payroll table so employees without a generated payroll
 * still show up with their base salary and a "Not Generated" status.
 */
export const getWagesOverview = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { month, year } = req.query;
    const overview = await Wage.findOverviewByTenant(tenantId, { month, year });
    res.json({ success: true, overview });
  } catch (error) {
    console.error('Get wages overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWageById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const wage = await Wage.findById(req.params.id, tenantId);
    if (!wage) return res.status(404).json({ message: 'Wage record not found' });
    res.json({ success: true, wage });
  } catch (error) {
    console.error('Get wage by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { amount, type, remarks, paymentMethod, paymentReference } = req.body;
    if (!amount || !type) return res.status(400).json({ message: 'amount and type are required' });

    const result = await Wage.recordPayment(req.params.id, tenantId, { amount, type, remarks, paymentMethod, paymentReference });
    res.status(201).json({ success: true, message: 'Payment recorded successfully', ...result });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const history = await Wage.fetchPaymentHistory(req.params.id);
    res.json({ success: true, history });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const result = await Wage.updatePayment(req.params.transactionId, tenantId, req.body);
    res.json({ success: true, message: 'Payment updated successfully', ...result });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(400).json({ message: error.message || 'Server error' });
  }
};