-- Create database
-- psql -U postgres
-- CREATE DATABASE factory_management;

-- Connect to database
-- \c factory_management;

-- Drop existing tables (if any) - BE CAREFUL IN PRODUCTION
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS tenants CASCADE;

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tenants_code ON tenants(code);

-- Insert default Super Admin
INSERT INTO users (email, password_hash, first_name, last_name, role, status)
VALUES (
    'super@admin.com',
    '$2a$10$7L4p6pXgMsQHrqBDtVcYweI4Q5JdZjLpFzGk9wDpLrXkMpZ3PqV5O',
    'Super',
    'Admin',
    'super_admin',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert default factory/tenant
INSERT INTO tenants (name, code, status)
VALUES ('Apex Garments', 'APX001', 'active')
ON CONFLICT (code) DO NOTHING;

-- Insert default admin for tenant
-- password: password123
INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, status)
SELECT 
    id,
    'admin@apex.com',
    '$2a$10$7L4p6pXgMsQHrqBDtVcYweI4Q5JdZjLpFzGk9wDpLrXkMpZ3PqV5O',
    'Admin',
    'User',
    'admin',
    'active'
FROM tenants 
WHERE code = 'APX001'
AND NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@apex.com'
);

-- Verify data
SELECT '=== USERS ===' as "";
SELECT id, email, first_name, last_name, role, status FROM users;

SELECT '=== TENANTS ===' as "";
SELECT id, name, code, status FROM tenants;