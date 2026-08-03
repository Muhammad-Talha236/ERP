import { pool } from '../config/database.js';

// Helper to convert database row (snake_case) to frontend representation (camelCase)
const mapRowToEmployee = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    employeeCode: row.employee_code,
    firstName: row.first_name,
    lastName: row.last_name,
    department: row.department,
    designation: row.designation,
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    hireDate: row.hire_date ? new Date(row.hire_date).toISOString().split('T')[0] : null,
    salaryType: row.salary_type,
    baseSalary: row.base_salary ? parseFloat(row.base_salary) : 0,
    status: row.status,
    profileImage: row.profile_image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const Employee = {
  create: async (data, tenantId) => {
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
      profileImage,
    } = data;

    const query = `
      INSERT INTO employees (
        tenant_id, employee_code, first_name, last_name,
        department, designation, email, phone,
        gender, hire_date, salary_type, base_salary, status, profile_image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      tenantId,
      employeeCode,
      firstName,
      lastName,
      department,
      designation,
      email || null,
      phone,
      gender,
      hireDate,
      salaryType,
      baseSalary || 0,
      status || 'Active',
      profileImage || null,
    ];

    const result = await pool.query(query, values);
    return mapRowToEmployee(result.rows[0]);
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { search, department, status } = filters;
    let query = `
      SELECT * FROM employees
      WHERE tenant_id = $1
    `;
    const values = [tenantId];
    let paramCounter = 2;

    if (department && department !== 'All Departments' && department.trim() !== '') {
      query += ` AND department = $${paramCounter}`;
      values.push(department);
      paramCounter++;
    }

    if (status && status !== 'All Statuses' && status.trim() !== '') {
      query += ` AND status = $${paramCounter}`;
      values.push(status);
      paramCounter++;
    }

    if (search && search.trim() !== '') {
      query += ` AND (
        employee_code ILIKE $${paramCounter} OR
        first_name ILIKE $${paramCounter} OR
        last_name ILIKE $${paramCounter} OR
        email ILIKE $${paramCounter} OR
        phone ILIKE $${paramCounter}
      )`;
      values.push(`%${search}%`);
      paramCounter++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows.map(mapRowToEmployee);
  },

  findById: async (id, tenantId) => {
    const query = `
      SELECT * FROM employees
      WHERE id = $1 AND tenant_id = $2
    `;
    const result = await pool.query(query, [id, tenantId]);
    return mapRowToEmployee(result.rows[0]);
  },

  update: async (id, tenantId, updates) => {
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
      profileImage,
    } = updates;

    const query = `
      UPDATE employees
      SET employee_code = COALESCE($1, employee_code),
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          department = COALESCE($4, department),
          designation = COALESCE($5, designation),
          email = COALESCE($6, email),
          phone = COALESCE($7, phone),
          gender = COALESCE($8, gender),
          hire_date = COALESCE($9, hire_date),
          salary_type = COALESCE($10, salary_type),
          base_salary = COALESCE($11, base_salary),
          status = COALESCE($12, status),
          profile_image = COALESCE($13, profile_image),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $14 AND tenant_id = $15
      RETURNING *
    `;

    const values = [
      employeeCode,
      firstName,
      lastName,
      department,
      designation,
      email || null,
      phone,
      gender,
      hireDate,
      salaryType,
      baseSalary || 0,
      status,
      profileImage || null,
      id,
      tenantId,
    ];

    const result = await pool.query(query, values);
    return mapRowToEmployee(result.rows[0]);
  },

  delete: async (id, tenantId) => {
    const query = `
      DELETE FROM employees
      WHERE id = $1 AND tenant_id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [id, tenantId]);
    return result.rows[0];
  },
};
