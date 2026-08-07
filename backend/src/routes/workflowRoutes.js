import express from 'express';
import {
  getWorkflowTemplates,
  createWorkflowTemplate,
  updateWorkflowTemplate, // ✅ naya
  deleteWorkflowTemplate, // ✅ naya
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

// --- WORKFLOW TEMPLATES ROUTE ---
router.get('/', getWorkflowTemplates);
router.post('/', createWorkflowTemplate);

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

// --- TEMPLATE EDIT/DELETE (dynamic, isliye sabse neeche) ---
router.put('/:id', updateWorkflowTemplate);   // ✅ naya
router.delete('/:id', deleteWorkflowTemplate); // ✅ naya

export default router;