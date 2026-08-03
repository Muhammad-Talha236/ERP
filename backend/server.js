import app from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Database connect karein
await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
});