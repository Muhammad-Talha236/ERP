import { DailyUsage } from '../models/dailyUsage.js';

export const getDailyUsage = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.headers['tenant-id'] || 1; 
    const usages = await DailyUsage.findByTenant(tenantId);
    res.json({ success: true, data: usages });
  } catch (err) {
    console.error('Fetch daily usage error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDailyUsage = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.headers['tenant-id'] || 1;
    const userName = req.user?.name || req.user?.email || 'Admin';

    const { materialId, material_id, quantityUsed, quantity_used, usageDate, usage_date, remarks, recordedBy, recorded_by } = req.body;
    
    const resolvedMaterialId = materialId || material_id;
    const resolvedQuantity = quantityUsed || quantity_used;
    const resolvedDate = usageDate || usage_date || new Date().toISOString().split('T')[0];

    if (!resolvedMaterialId || !resolvedQuantity) {
      return res.status(400).json({ success: false, message: 'Material ID and quantity are required.' });
    }

    const cleanData = {
      materialId: resolvedMaterialId,
      quantityUsed: resolvedQuantity,
      usageDate: resolvedDate,
      remarks: remarks || null,
      recordedBy: recorded_by || recordedBy || userName
    };

    const newUsage = await DailyUsage.create(tenantId, cleanData);
    res.status(201).json({ success: true, data: newUsage });
  } catch (err) {
    console.error('Create daily usage error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateDailyUsage = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.headers['tenant-id'] || 1;
    const updated = await DailyUsage.update(req.params.id, tenantId, req.body);
    res.json({ success: true, message: 'Daily usage updated successfully', data: updated });
  } catch (err) {
    console.error('Update daily usage error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteDailyUsage = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.headers['tenant-id'] || 1;
    await DailyUsage.delete(req.params.id, tenantId);
    res.json({ success: true, message: 'Daily usage deleted successfully' });
  } catch (err) {
    console.error('Delete daily usage error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};