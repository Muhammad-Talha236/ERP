import express from 'express';
import {
  getOrderStages,
  saveOrderStages,
  getWorkflowBundles,
  createBundle,
  splitBundle,
  deleteBundle,
  logBundleMovement,
  advanceBundleStage,
  getMovementLogs,
  updateBundle,
  getBundleAssignments,
  assignEmployeeToBundle,
  completeBundleAssignment
} from '../controllers/workflowController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stages/:poNumber', getOrderStages);
router.post('/stages/:poNumber', saveOrderStages);

// --- STATIC ROUTES (Hamesha upar honay chahiyein) ---
router.get('/bundles', getWorkflowBundles);
router.post('/bundles', createBundle);
router.post('/bundles/split', splitBundle);
router.post('/bundles/advance-stage', advanceBundleStage);
router.patch('/bundles/assignments/:assignmentId/complete', completeBundleAssignment);

// --- DYNAMIC ROUTES (Hamesha neeche honay chahiyein) ---
router.delete('/bundles/:bundleId', deleteBundle);
router.post('/bundles/:bundleId/log', logBundleMovement);
router.patch('/bundles/:bundleId', updateBundle);
router.get('/bundles/:bundleId/assignments', getBundleAssignments);
router.post('/bundles/:bundleId/assign', assignEmployeeToBundle);

router.get('/logs/:poNumber', getMovementLogs);

export default router;