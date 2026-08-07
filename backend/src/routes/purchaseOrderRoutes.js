import express from 'express';
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  markAsReceived,
  recordPayment,
  getPaymentHistory,
  updatePOPayment, // <- Yeh import ensure karein
} from '../controllers/purchaseOrderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getPurchaseOrders);
router.get('/:id', getPurchaseOrderById);
router.post('/', createPurchaseOrder);
router.put('/:id', updatePurchaseOrder);
router.patch('/:id/receive', markAsReceived);
router.get('/:id/payments', getPaymentHistory);
router.post('/:id/payments', recordPayment);
router.put('/payments/:transactionId', updatePOPayment); // <- Yeh route add karein

export default router;