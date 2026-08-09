import express from 'express';
import {
  createWage,
  generatePayroll,
  approveWage,
  getWageDeductions,
  getWages,
  getWagesOverview,
  getWageById,
  recordPayment,
  getPaymentHistory,
  updatePayment,
} from '../controllers/wageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWages);
router.get('/overview', getWagesOverview); // must come before '/:id'
router.post('/', createWage);
router.post('/generate', generatePayroll);

router.get('/:id', getWageById);
router.patch('/:id/approve', approveWage);
router.get('/:id/deductions', getWageDeductions);
router.get('/:id/payments', getPaymentHistory);
router.post('/:id/payments', recordPayment);

router.put('/payments/:transactionId', updatePayment);

export default router;