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

export const getWages = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { employeeId, status } = req.query;
    const wages = await Wage.findByTenant(tenantId, { employeeId, status });
    res.json({ success: true, wages });
  } catch (error) {
    console.error('Get wages error:', error);
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
    const { amount, type, remarks } = req.body;
    if (!amount || !type) return res.status(400).json({ message: 'amount and type are required' });

    const result = await Wage.recordPayment(req.params.id, tenantId, { amount, type, remarks });
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