import { Tenant } from '../models/tenant.js';
import { User } from '../models/user.js';

export const createTenant = async (req, res) => {
  try {
    const name = req.body.companyName || req.body.name;
    const code = req.body.companyCode || req.body.code;
    const { adminEmail, adminPassword, adminFirstName, adminLastName } = req.body;

    if (!name || !code || !adminEmail || !adminPassword || !adminFirstName || !adminLastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingTenants = await Tenant.findAll();
    if (existingTenants.some(t => t.companyCode === code)) {
      return res.status(400).json({ message: 'Tenant code already exists' });
    }

    const existingUser = await User.findByEmail(adminEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'Admin email already registered' });
    }

    const tenant = await Tenant.create({ name, code });

    const adminUser = await User.create({
      email: adminEmail,
      password: adminPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      role: 'admin',
      tenantId: tenant.id,
    });

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      tenant,
      admin: adminUser,
    });
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.json({
      success: true,
      tenants,
    });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const name = req.body.companyName || req.body.name || null;
    const code = req.body.companyCode || req.body.code || null;
    const status = req.body.status ? req.body.status.toLowerCase() : null;

    const tenant = await Tenant.update(req.params.id, { name, code, status });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({
      success: true,
      message: 'Tenant updated successfully',
      tenant,
    });
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.delete(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({
      success: true,
      message: 'Tenant deleted successfully',
    });
  } catch (error) {
    console.error('Delete tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};