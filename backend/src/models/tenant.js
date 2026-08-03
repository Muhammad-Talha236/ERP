import { pool } from '../config/database.js';

export const Tenant = {
  create: async (data) => {
    const { name, code } = data;
    const query = `
      INSERT INTO tenants (name, code)
      VALUES ($1, $2)
      RETURNING id, name as "companyName", code as "companyCode", status, created_at as "createdAt"
    `;
    const result = await pool.query(query, [name, code]);
    const row = result.rows[0];
    return {
      ...row,
      status: row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Active',
      email: '',
      employeeCount: 0
    };
  },

  findAll: async () => {
    const query = `
      SELECT 
        t.id, 
        t.name as "companyName", 
        t.code as "companyCode", 
        t.status, 
        t.created_at as "createdAt",
        COALESCE(
          (SELECT email FROM users WHERE tenant_id = t.id AND role = 'admin' LIMIT 1),
          ''
        ) as email,
        (SELECT COUNT(*)::int FROM employees WHERE tenant_id = t.id) as "employeeCount"
      FROM tenants t
      ORDER BY t.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      ...row,
      status: row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Active'
    }));
  },

  findById: async (id) => {
    const query = `
      SELECT 
        t.id, 
        t.name as "companyName", 
        t.code as "companyCode", 
        t.status, 
        t.created_at as "createdAt",
        COALESCE(
          (SELECT email FROM users WHERE tenant_id = t.id AND role = 'admin' LIMIT 1),
          ''
        ) as email,
        (SELECT COUNT(*)::int FROM employees WHERE tenant_id = t.id) as "employeeCount"
      FROM tenants t
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      status: row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Active'
    };
  },

  update: async (id, data) => {
    const { name, code, status } = data;
    const query = `
      UPDATE tenants
      SET name = COALESCE($1, name),
          code = COALESCE($2, code),
          status = COALESCE($3, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name as "companyName", code as "companyCode", status, created_at as "createdAt"
    `;
    const result = await pool.query(query, [name, code, status, id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      ...row,
      status: row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Active'
    };
  },

  delete: async (id) => {
    const query = 'DELETE FROM tenants WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};