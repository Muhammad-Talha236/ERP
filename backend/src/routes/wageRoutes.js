import express from 'express';
import {
  createWage,
  getWages,
  getWageById,
  recordPayment,
  getPaymentHistory,
  updatePayment,
} from '../controllers/wageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWages);
router.get('/:id', getWageById);
router.post('/', createWage);
router.get('/:id/payments', getPaymentHistory);
router.post('/:id/payments', recordPayment);
router.put('/payments/:transactionId', updatePayment);

export default router;