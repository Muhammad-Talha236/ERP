import app from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Database connect karein
await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Production Orders: http://localhost:${PORT}/api/production-orders`);
  console.log(`📋 Workflows: http://localhost:${PORT}/api/workflows`);
});