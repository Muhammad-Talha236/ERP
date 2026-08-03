import express from 'express';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
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

export default router;
