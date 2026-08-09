import { Loan } from '../models/loan.js';

export const createLoan = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { employeeId, loanAmount, installmentAmount, startDate, durationMonths, reason } = req.body;
    if (!employeeId || !loanAmount || !installmentAmount || !startDate) {
      return res.status(400).json({ message: 'employeeId, loanAmount, installmentAmount and startDate are required' });
    }
    const loan = await Loan.create({ employeeId, loanAmount, installmentAmount, startDate, durationMonths, reason }, tenantId);
    res.status(201).json({ success: true, message: 'Loan recorded successfully', loan });
  } catch (error) {
    console.error('Create loan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLoans = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { employeeId, status } = req.query;
    const loans = await Loan.findByTenant(tenantId, { employeeId, status });
    res.json({ success: true, loans });
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const loan = await Loan.findById(req.params.id, tenantId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json({ success: true, loan });
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};