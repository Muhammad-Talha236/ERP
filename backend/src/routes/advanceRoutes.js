import express from 'express';
import { createAdvance, getAdvances, getAdvanceById } from '../controllers/advanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getAdvances);
router.get('/:id', getAdvanceById);
router.post('/', createAdvance);

export default router;