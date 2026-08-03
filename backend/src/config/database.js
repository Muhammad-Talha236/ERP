import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Neon connection string se pool banayein
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon ke liye zaroori hai
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 50000,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL (Neon) connected successfully');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.log('💡 Make sure DATABASE_URL is correct in .env file');
    console.log('   Check your Neon connection string');
    process.exit(1);
  }
};

export { pool };