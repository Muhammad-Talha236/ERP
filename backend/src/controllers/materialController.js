import { Material } from '../models/material.js';

export const createMaterial = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { materialCode, materialName, unit } = req.body;
    if (!materialCode || !materialName || !unit) {
      return res.status(400).json({ message: 'materialCode, materialName and unit are required' });
    }

    const existing = await Material.findByTenant(tenantId, { search: materialCode });
    if (existing.some((m) => m.materialCode === materialCode)) {
      return res.status(400).json({ message: `Material code ${materialCode} already exists` });
    }

    const material = await Material.create(req.body, tenantId);
    res.status(201).json({ success: true, message: 'Material created successfully', material });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMaterials = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    const { search, stock } = req.query;
    const materials = await Material.findByTenant(tenantId, { search, stock });
    res.json({ success: true, materials });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const material = await Material.findById(req.params.id, tenantId);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json({ success: true, material });
  } catch (error) {
    console.error('Get material by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const material = await Material.update(req.params.id, tenantId, req.body);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    res.json({ success: true, message: 'Material updated successfully', material });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const deleted = await Material.delete(req.params.id, tenantId);
    if (!deleted) return res.status(404).json({ message: 'Material not found' });
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};