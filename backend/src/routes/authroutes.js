import express from 'express';
import { login, register, getMe, logout } from '../controllers/authcontroller.js';
import { protect, restrictToSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/register', protect, restrictToSuperAdmin, register);

export default router;