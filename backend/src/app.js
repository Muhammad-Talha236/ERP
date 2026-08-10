import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authroutes.js';
import tenantRoutes from './routes/tenantroutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import productionOrdersRouter from './routes/productionOrders.js'; // ✅ ADDED
import materialRoutes from './routes/materialRoutes.js';
import wageRoutes from './routes/wageRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import dailyUsageRoutes from './routes/dailyUsageRoutes.js';
import advanceRoutes from './routes/advanceRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
dotenv.config();

const app = express();

// FIX: disable Express's default ETag/conditional-GET caching.
// Without this, the browser can send If-None-Match on a GET and
// receive a 304 (empty body, "use your old cached copy") even
// after the underlying data has changed — exactly what caused
// employees added directly in Neon to not show up until this was
// disabled. API responses should always be fresh, never cached.
app.disable('etag');
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://factory-management-erp.vercel.app', // deploy ke baad yahan real URL daalein
  ],
  credentials: true,
}));
// Connect to PostgreSQL
await connectDB();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/production-orders', productionOrdersRouter); // ✅ ADDED — must be before 404 handler
app.use('/api/materials', materialRoutes);
app.use('/api/wages', wageRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/daily-usage', dailyUsageRoutes);
app.use('/api/advances', advanceRoutes);
app.use('/api/loans', loanRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Factory Management API',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler — ALWAYS LAST
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

export default app