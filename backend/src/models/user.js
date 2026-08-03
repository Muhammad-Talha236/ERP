import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const User = {
  create: async (userData) => {
  const { email, password, firstName, lastName, role, tenantId } = userData;
  const passwordHash = await bcrypt.hash(password, 10);
  const fullName = `${firstName} ${lastName}`.trim();

  const query = `
    INSERT INTO users (email, password, name, role, tenant_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, name, role, tenant_id, status, created_at
  `;
  const values = [email, passwordHash, fullName, role, tenantId];
  const result = await pool.query(query, values);
  return result.rows[0];
},

  findByEmail: async (email) => {
    // ✅ FIX: first_name aur last_name hata kar sirf 'name' use kiya hai
    const query = `
      SELECT id, email, password, name, role, tenant_id, status, created_at 
      FROM users
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const query = `
      SELECT id, email, name, role, status, tenant_id, created_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  findAll: async () => {
    const query = `
      SELECT id, email, name, role, status, tenant_id, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  findByTenant: async (tenantId) => {
    const query = `
      SELECT id, email, name, role, status, created_at
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [tenantId]);
    return result.rows;
  },

  updateStatus: async (id, status) => {
    const query = `
      UPDATE users
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, name, role, status
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  },

  verifyPassword: async (user, password) => {
    return await bcrypt.compare(password, user.password);
  },
};