import express from 'express';
import { createLoan, getLoans, getLoanById } from '../controllers/loanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getLoans);
router.get('/:id', getLoanById);
router.post('/', createLoan);

export default router;