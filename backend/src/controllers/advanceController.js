import { Advance } from '../models/advance.js';

export const createAdvance = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { employeeId, amount, advanceDate, reason, recoveryType, installmentAmount } = req.body;
    if (!employeeId || !amount) {
      return res.status(400).json({ message: 'employeeId and amount are required' });
    }
    if (recoveryType === 'Installment' && !(Number(installmentAmount) > 0)) {
      return res.status(400).json({ message: 'installmentAmount is required for installment-based recovery' });
    }
    const advance = await Advance.create({ employeeId, amount, advanceDate, reason, recoveryType, installmentAmount }, tenantId);
    res.status(201).json({ success: true, message: 'Advance recorded successfully', advance });
  } catch (error) {
    console.error('Create advance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdvances = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { employeeId, status } = req.query;
    const advances = await Advance.findByTenant(tenantId, { employeeId, status });
    res.json({ success: true, advances });
  } catch (error) {
    console.error('Get advances error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAdvanceById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const advance = await Advance.findById(req.params.id, tenantId);
    if (!advance) return res.status(404).json({ message: 'Advance not found' });
    res.json({ success: true, advance });
  } catch (error) {
    console.error('Get advance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};