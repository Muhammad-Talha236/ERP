import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeWorkAssignments,
} from '../controllers/employeeController.js';
import { protect, restrictToAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(restrictToAdmin);

router.post('/', createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.get('/:id/work', getEmployeeWorkAssignments);
export default router;
