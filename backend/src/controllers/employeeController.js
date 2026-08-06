import { pool } from '../config/database.js'; // Kyunki db.js mein named export { pool } hai
import { Employee } from '../models/employee.js';
export const createEmployee = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required for employee operations' });
    }

    const {
      employeeCode,
      firstName,
      lastName,
      department,
      designation,
      email,
      phone,
      gender,
      hireDate,
      salaryType,
      baseSalary,
      status,
    } = req.body;

    if (!employeeCode || !firstName || !lastName || !department || !designation || !phone || !gender || !hireDate || !salaryType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if employee code already exists for this tenant
    const existing = await Employee.findByTenant(tenantId, { search: employeeCode });
    if (existing.some(e => e.employeeCode === employeeCode)) {
      return res.status(400).json({ message: `Employee code ${employeeCode} already exists` });
    }

    const employee = await Employee.create(req.body, tenantId);

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee,
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const { search, department, status } = req.query;
    const employees = await Employee.findByTenant(tenantId, { search, department, status });

    // React query/UI consistently expects the direct array or an envelope
    res.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const employee = await Employee.findById(req.params.id, tenantId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error('Get employee by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const employee = await Employee.update(req.params.id, tenantId, req.body);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};export const deleteEmployee = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const employeeId = req.params.id;

    // 1. Related attendance aur leave requests delete karein
    await pool.query(
      `DELETE FROM attendance WHERE employee_id = $1 AND tenant_id = $2`,
      [employeeId, tenantId]
    );

    await pool.query(
      `DELETE FROM leave_requests WHERE employee_id = $1 AND tenant_id = $2`,
      [employeeId, tenantId]
    );

    // 2. Employee ko delete karein
    const deleted = await Employee.delete(employeeId, tenantId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee and related records deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};