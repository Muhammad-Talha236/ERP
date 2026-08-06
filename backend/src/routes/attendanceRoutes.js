import express from 'express';
import {
  markAttendance,
  getAttendance,
  updateAttendance,
  createLeaveRequestHandler,
  getLeaveRequestsHandler,
  updateLeaveRequestHandler,
  editLeaveRequestHandler,
  deleteLeaveRequestHandler,
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// 1. Static Leave Request Routes (Hamesha upar honay chahiyein)
router.get('/leave-requests', getLeaveRequestsHandler);
router.post('/leave-requests', createLeaveRequestHandler);
router.put('/leave-requests/:id', editLeaveRequestHandler);
router.patch('/leave-requests/:id', updateLeaveRequestHandler);
router.delete('/leave-requests/:id', deleteLeaveRequestHandler);
// 2. General Attendance Routes (Hamesha neeche honay chahiyein)
router.get('/', getAttendance);
router.post('/', markAttendance);
router.put('/:id', updateAttendance);
router.put('/leave-requests/:id', editLeaveRequestHandler);

export default router;