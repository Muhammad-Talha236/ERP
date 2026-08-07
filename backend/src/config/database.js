import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon ke liye zaroori hai
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Timeout ko thoda behtar kiya hai (10 seconds)
  keepAlive: true, // Connection ko zinda rakhne ke liye
});

// CRITICAL FIX: Unhandled error event catch karne ke liye taaki app crash na ho
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  // App crash hone se bachane ke liye yahan process.exit(1) nahi lagana
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('📦 PostgreSQL (Neon) connected successfully');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.log('🔍 Make sure DATABASE_URL is correct in .env file');
    process.exit(1);
  }
};

export { pool };