import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    const isPasswordValid = await User.verifyPassword(user, password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    const userResponse = {
      id: user.id,
      email: user.email,
     name: user.name,
      role: user.role,
      tenantId: user.tenant_id,
      tenantName: user.tenant_name,
      status: user.status,
    };

    res.json({
      success: true,
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, tenantId } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (req.user && req.user.role === 'super_admin' && role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot create another Super Admin' });
    }

    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'admin',
      tenantId: tenantId || null,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};