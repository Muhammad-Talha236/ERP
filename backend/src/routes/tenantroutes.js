import express from 'express';
import {
  createTenant,
  getTenants,
  getTenant,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantcontroller.js';
import { protect, restrictToSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(restrictToSuperAdmin);

router.post('/', createTenant);
router.get('/', getTenants);
router.get('/:id', getTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;