import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, tenantId: user.tenant_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // 👇 YEH 4 LINES ADD KAREIN (Mock token ko bypass karne ke liye)
  if (token.startsWith('mock-token-')) {
    req.user = { id: 2, role: 'super_admin' }; // Mock user assign karo
    return next(); // Middleware se aage badh jao
  }
  
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const restrictToSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
  next();
};

export const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};