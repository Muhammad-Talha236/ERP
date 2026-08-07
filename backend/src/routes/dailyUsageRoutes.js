import express from 'express';
import { getDailyUsage, createDailyUsage, updateDailyUsage, deleteDailyUsage } from '../controllers/dailyUsageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getDailyUsage);
router.post('/', createDailyUsage);
router.put('/:id', updateDailyUsage);
router.delete('/:id', deleteDailyUsage);

export default router;