import { pool as db } from '../config/database.js';

// --- WORKFLOW TEMPLATES (GET & CREATE) ---
export const getWorkflowTemplates = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        wt.id, 
        wt.template_name AS "templateName",
        json_agg(
          json_build_object(
            'stageName', wts.stage_name,
            'stageExpense', wts.expense,
            'wagePerPerson', wts.wage_per_person,
            'headcount', wts.headcount,
            'position', wts.position
          ) ORDER BY wts.position ASC
        ) AS stages
      FROM workflow_templates wt
      LEFT JOIN workflow_template_stages wts ON wt.id = wts.template_id
      GROUP BY wt.id
      ORDER BY wt.id DESC;
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in getWorkflowTemplates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createWorkflowTemplate = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { templateName, stages } = req.body;

    if (!templateName || !templateName.trim()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Template name is required' });
    }

    const existing = await client.query(
      'SELECT id FROM workflow_templates WHERE LOWER(template_name) = LOWER($1)',
      [templateName.trim()]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: `A template named "${templateName.trim()}" already exists. Please choose a different name.`,
      });
    }

    const templateQuery = `
      INSERT INTO workflow_templates (template_name)
      VALUES ($1)
      RETURNING id, template_name AS "templateName";
    `;
    const templateResult = await client.query(templateQuery, [templateName.trim()]);
    const newTemplate = templateResult.rows[0];

    if (Array.isArray(stages) && stages.length > 0) {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const stageName = stage.name || stage.stageName || stage.stage_name;
        const expense = stage.expense || stage.expense === 0 ? stage.expense : 0;
        const wage = stage.wage_per_person ?? stage.wagePerPerson ?? stage.wage ?? 0;
        const headcount = stage.headcount || 1;

        await client.query(
          `INSERT INTO workflow_template_stages (template_id, stage_name, expense, wage_per_person, headcount, position)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [newTemplate.id, stageName, expense, wage, headcount, i + 1]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({
      success: true,
      message: 'Workflow template created successfully',
      data: newTemplate,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in createWorkflowTemplate:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

export const updateWorkflowTemplate = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { templateName, stages } = req.body;

    if (!templateName || !templateName.trim()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Template name is required' });
    }

    const existing = await client.query(
      'SELECT id FROM workflow_templates WHERE LOWER(template_name) = LOWER($1) AND id != $2',
      [templateName.trim(), id]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: `A template named "${templateName.trim()}" already exists. Please choose a different name.`,
      });
    }

    const updateResult = await client.query(
      `UPDATE workflow_templates SET template_name = $1 WHERE id = $2 RETURNING id, template_name AS "templateName"`,
      [templateName.trim(), id]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    await client.query('DELETE FROM workflow_template_stages WHERE template_id = $1', [id]);

    if (Array.isArray(stages) && stages.length > 0) {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const stageName = stage.name || stage.stageName || stage.stage_name;
        const expense = stage.expense || stage.expense === 0 ? stage.expense : 0;
        const wage = stage.wage_per_person ?? stage.wagePerPerson ?? stage.wage ?? 0;
        const headcount = stage.headcount || 1;

        await client.query(
          `INSERT INTO workflow_template_stages (template_id, stage_name, expense, wage_per_person, headcount, position)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, stageName, expense, wage, headcount, i + 1]
        );
      }
    }

    await client.query('COMMIT');
    res.status(200).json({
      success: true,
      message: 'Workflow template updated successfully',
      data: updateResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in updateWorkflowTemplate:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

export const deleteWorkflowTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM workflow_templates WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }

    res.status(200).json({ success: true, message: 'Workflow template deleted successfully' });
  } catch (error) {
    console.error('Error in deleteWorkflowTemplate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 1. GET /api/workflows/stages/:poNumber
export const getOrderStages = async (req, res) => {
  try {
    const { poNumber } = req.params;
    const result = await db.query(
      'SELECT * FROM order_workflow_steps WHERE po_number = $1 ORDER BY position ASC',
      [poNumber]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error in getOrderStages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. POST /api/workflows/stages/:poNumber
const syncOrderWorkflowStagesMirror = async (poNumber, stages) => {
  const stagesTableExists = await db.query(
    `SELECT EXISTS (
       SELECT 1
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'order_workflow_stages'
     ) AS exists`
  );

  if (!stagesTableExists.rows[0]?.exists) return;

  await db.query('DELETE FROM order_workflow_stages WHERE po_number = $1', [poNumber]);

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const stageName = stage.name || stage.stageName || stage.stage_name;
    const expense = stage.expense || stage.expense === 0 ? stage.expense : 0;
    const wage = stage.wage_per_person ?? stage.wagePerPerson ?? stage.wage ?? 0;
    const headcount = stage.headcount || 1;

    await db.query(
      `INSERT INTO order_workflow_stages (po_number, stage_name, expense, wage_per_person, headcount, position)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [poNumber, stageName, expense, wage, headcount, i + 1]
    );
  }
};

// ✅ Reusable — used by both saveOrderStages (Workflow page) and
// productionOrders.js (PO creation), so both go through one code path.
export const saveOrderStagesForOrder = async (poNumber, stages) => {
  await db.query('BEGIN');
  try {
    await db.query('DELETE FROM order_workflow_steps WHERE po_number = $1', [poNumber]);

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      const stageName = stage.name || stage.stageName || stage.stage_name;
      const expense = stage.expense || stage.expense === 0 ? stage.expense : 0;
      const wage = stage.wage_per_person ?? stage.wagePerPerson ?? stage.wage ?? 0;
      const headcount = stage.headcount || 1;

      await db.query(
        `INSERT INTO order_workflow_steps (po_number, stage_name, expense, wage_per_person, headcount, position)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [poNumber, stageName, expense, wage, headcount, i + 1]
      );
    }

    await syncOrderWorkflowStagesMirror(poNumber, stages);
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};

export const saveOrderStages = async (req, res) => {
  try {
    const { poNumber } = req.params;
    const { stages } = req.body;
    await saveOrderStagesForOrder(poNumber, stages);
    res.json({ success: true, message: 'Workflow stages updated successfully' });
  } catch (error) {
    console.error('Error in saveOrderStages:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const mapBundleRow = (row) => ({
  id: String(row.bundle_code ?? row.id),
  bundleNumber: row.bundle_code ?? String(row.id),
  bundleCode: row.bundle_code ?? String(row.id),
  poNumber: row.po_number,
  quantity: row.quantity,
  currentStageName: row.current_stage,
  currentStageOrder: row.stage_order,
  assignedEmployeeName: row.assigned_employee,
  status: row.status,
  createdAt: row.created_at,
  orderId: row.order_id ?? row.po_number,
});

const mapMovementLogRow = (row) => ({
  id: row.id,
  bundleId: row.bundle_id,
  orderId: row.order_id,
  stageName: row.stage_name,
  stageOrder: row.stage_order,
  loggedByEmployeeId: row.logged_by_employee_id,
  loggedByEmployeeName: row.logged_by_employee_name,
  quantityReceived: row.quantity_received,
  quantityOutput: row.quantity_output,
  quantityWastage: row.quantity_wastage,
  remarks: row.remarks,
  date: row.timestamp ?? row.created_at,
  action: row.action,
});

const resolveBundleId = async (bundleIdentifier) => {
  if (!isNaN(Number(bundleIdentifier))) {
    return Number(bundleIdentifier);
  }

  let result = await db.query('SELECT id FROM workflow_bundles WHERE bundle_code = $1 LIMIT 1', [bundleIdentifier]);
  if (result.rows.length > 0) return result.rows[0].id;

  result = await db.query('SELECT id FROM workflow_bundles WHERE id::text = $1 LIMIT 1', [bundleIdentifier]);
  if (result.rows.length > 0) return result.rows[0].id;

  throw new Error(`Bundle not found for identifier: ${bundleIdentifier}`);
};

// 3. GET /api/workflows/bundles
export const getWorkflowBundles = async (req, res) => {
  try {
    const { poNumber } = req.query;
    const result = await db.query(
      `SELECT b.*, s.position AS stage_order
       FROM workflow_bundles b
       LEFT JOIN order_workflow_steps s
         ON b.po_number = s.po_number AND b.current_stage = s.stage_name
       WHERE b.po_number = $1
       ORDER BY b.id ASC`,
      [poNumber]
    );
    res.json({ success: true, data: result.rows.map(mapBundleRow) });
  } catch (error) {
    console.error('Error in getWorkflowBundles:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. POST /api/workflows/bundles
export const createBundle = async (req, res) => {
  try {
    const { poNumber, quantity, stageName } = req.body;
    const qtyNum = Number(quantity);

    if (!qtyNum || qtyNum <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    const orderRes = await db.query(
      'SELECT quantity FROM production_orders WHERE po_number = $1',
      [poNumber]
    );
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Production order not found' });
    }
    const orderQuantity = Number(orderRes.rows[0].quantity);

    const existingRes = await db.query(
      `SELECT COALESCE(SUM(quantity), 0) AS total FROM workflow_bundles WHERE po_number = $1`,
      [poNumber]
    );
    const alreadyAllocated = Number(existingRes.rows[0].total);

    if (alreadyAllocated + qtyNum > orderQuantity) {
      return res.status(400).json({
        success: false,
        message: `Bundle quantity cannot exceed the order's total quantity (${orderQuantity}). Available: ${orderQuantity - alreadyAllocated}.`,
      });
    }

    const bundleCode = `${poNumber}-${Date.now().toString().slice(-4)}`;

    const result = await db.query(
      `INSERT INTO workflow_bundles (bundle_code, po_number, quantity, current_stage, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [bundleCode, poNumber, qtyNum, stageName || 'Material Allocation', 'Not Started']
    );

    res.status(201).json({ success: true, data: mapBundleRow(result.rows[0]) });
  } catch (error) {
    console.error('Error in createBundle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. POST /api/workflows/bundles/split
export const splitBundle = async (req, res) => {
  const { sourceBundleId, newQty, poNumber } = req.body;

  try {
    const sourceRes = await db.query('SELECT * FROM workflow_bundles WHERE bundle_code = $1 LIMIT 1', [sourceBundleId]);

    if (sourceRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Source bundle not found' });
    }

    const sourceBundle = sourceRes.rows[0];

    if (Number(sourceBundle.quantity) <= Number(newQty)) {
      return res.status(400).json({
        success: false,
        message: 'Split quantity must be less than current bundle quantity',
      });
    }

    const updatedSourceQty = Number(sourceBundle.quantity) - Number(newQty);
    const newBundleCode = `${poNumber}-${Date.now().toString().slice(-4)}`;

    await db.query('UPDATE workflow_bundles SET quantity = $1 WHERE bundle_code = $2', [updatedSourceQty, sourceBundleId]);

    const insertRes = await db.query(
      `INSERT INTO workflow_bundles (bundle_code, po_number, quantity, current_stage, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [newBundleCode, poNumber, newQty, sourceBundle.current_stage || 'Material Allocation', sourceBundle.status || 'Not Started']
    );

    const numericOrderId = sourceBundle.order_id && !isNaN(Number(sourceBundle.order_id)) ? Number(sourceBundle.order_id) : null;

    await db.query(
      `INSERT INTO bundle_movement_logs
         (bundle_id, order_id, action, source_bundle, stage_name, stage_order, quantity_received, quantity_output, quantity_wastage, remarks, timestamp)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
      [
        sourceBundle.id,
        numericOrderId,
        'Split Bundle',
        sourceBundleId,
        sourceBundle.current_stage || 'Material Allocation',
        null,
        0,
        0,
        0,
        null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Bundle split successfully',
      data: mapBundleRow(insertRes.rows[0]),
    });
  } catch (error) {
    console.error('Error in splitBundle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. DELETE /api/workflows/bundles/:bundleId
export const deleteBundle = async (req, res) => {
  const { bundleId } = req.params;

  try {
    const resolvedBundleId = await resolveBundleId(bundleId);
    const result = await db.query('DELETE FROM workflow_bundles WHERE id = $1 RETURNING *', [resolvedBundleId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bundle not found' });
    }

    res.json({ success: true, data: mapBundleRow(result.rows[0]) });
  } catch (error) {
    console.error('Error in deleteBundle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. POST /api/workflows/bundles/advance-stage
export const advanceBundleStage = async (req, res) => {
  const { bundleId, nextStageName, nextStageOrder, isLastStage } = req.body;

  try {
    const resolvedBundleId = await resolveBundleId(bundleId);

    if (isLastStage) {
      await db.query(
        `UPDATE workflow_bundles SET status = 'Completed', current_stage = 'Completed' WHERE id = $1`,
        [resolvedBundleId]
      );
    } else {
      await db.query(
        `UPDATE workflow_bundles SET current_stage = $1, status = 'In Progress' WHERE id = $2`,
        [nextStageName, resolvedBundleId]
      );
    }

    res.json({ success: true, message: 'Stage advanced successfully' });
  } catch (error) {
    console.error('Error in advanceBundleStage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. POST /api/workflows/bundles/:bundleId/log
export const logBundleMovement = async (req, res) => {
  const { bundleId } = req.params;
  const {
    stageName,
    stageOrder,
    loggedByEmployeeId,
    quantityReceived,
    quantityOutput,
    quantityWastage,
    remarks,
  } = req.body;

  try {
    const resolvedBundleId = await resolveBundleId(bundleId);
    const bundleRes = await db.query('SELECT * FROM workflow_bundles WHERE id = $1', [resolvedBundleId]);

    if (bundleRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bundle not found' });
    }

    const bundle = bundleRes.rows[0];
    const tenantId = req.user?.tenant_id || bundle.tenant_id || 1;

    const numericOrderId = bundle.order_id && !isNaN(Number(bundle.order_id)) ? Number(bundle.order_id) : null;

    const insertRes = await db.query(
      `INSERT INTO bundle_movement_logs
         (bundle_id, tenant_id, action, timestamp, order_id, stage_name, stage_order, logged_by_employee_id, quantity_received, quantity_output, quantity_wastage, remarks)
       VALUES
         ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        resolvedBundleId,
        tenantId,
        'Movement Log',
        numericOrderId,
        stageName || bundle.current_stage,
        stageOrder || 1,
        loggedByEmployeeId ? Number(loggedByEmployeeId) : null,
        Number(quantityReceived || 0),
        Number(quantityOutput || 0),
        Number(quantityWastage || 0),
        remarks || null,
      ]
    );

    const outQty = Number(quantityOutput || 0);
    const wasteQty = Number(quantityWastage || 0);
    const currentQty = Number(bundle.quantity || 0);
    const newQuantity = Math.max(0, currentQty - (outQty + wasteQty));

    await db.query(
      `UPDATE workflow_bundles SET status = 'In Progress', current_stage = COALESCE($1, current_stage), quantity = $2 WHERE id = $3`,
      [stageName, newQuantity, resolvedBundleId]
    );

    const updatedBundleRes = await db.query('SELECT * FROM workflow_bundles WHERE id = $1', [resolvedBundleId]);

    res.status(201).json({
      success: true,
      data: {
        movement: mapMovementLogRow(insertRes.rows[0]),
        bundle: mapBundleRow(updatedBundleRes.rows[0]),
      },
    });
  } catch (error) {
    console.error('Error in logBundleMovement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. GET /api/workflows/logs/:poNumber
export const getMovementLogs = async (req, res) => {
  const { poNumber } = req.params;

  try {
    const logs = await db.query(
      `SELECT l.*, b.bundle_code, b.po_number
       FROM bundle_movement_logs l
       LEFT JOIN workflow_bundles b ON l.bundle_id = b.id
       WHERE b.po_number = $1 OR l.order_id::text = $1 OR l.bundle_id IN (SELECT id FROM workflow_bundles WHERE po_number = $1)
       ORDER BY l.timestamp DESC`,
      [poNumber]
    );

    res.json({ success: true, data: logs.rows.map(mapMovementLogRow) });
  } catch (error) {
    console.error('Error in getMovementLogs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10. PATCH /api/workflows/bundles/:bundleId
export const updateBundle = async (req, res) => {
  const { bundleId } = req.params;
  const { quantity } = req.body;

  try {
    const resolvedBundleId = await resolveBundleId(bundleId);
    const result = await db.query(
      `UPDATE workflow_bundles SET quantity = $1 WHERE id = $2 RETURNING *`,
      [Math.max(0, Number(quantity)), resolvedBundleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bundle not found' });
    }

    res.json({ success: true, message: 'Bundle updated successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error in updateBundle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 11. GET /api/workflows/bundles/:bundleId/assignments
export const getBundleAssignments = async (req, res) => {
  const { bundleId } = req.params;
  try {
    const resolvedBundleId = await resolveBundleId(bundleId);

    const result = await db.query(
      'SELECT * FROM bundle_stage_assignments WHERE bundle_id = $1',
      [resolvedBundleId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error in getBundleAssignments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 12. POST /api/workflows/bundles/:bundleId/assign
export const assignEmployeeToBundle = async (req, res) => {
  const { bundleId } = req.params;
  const { stepId, stageName, employeeId, employeeName, expense, wagePerPerson, headcount } = req.body;

  try {
    const resolvedBundleId = await resolveBundleId(bundleId);

    const result = await db.query(
      `INSERT INTO bundle_stage_assignments 
       (bundle_id, step_id, stage_name, employee_id, employee_name, expense, wage_per_person, headcount, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        resolvedBundleId,
        stepId ? String(stepId) : null,
        stageName ? String(stageName) : null,
        employeeId ? Number(employeeId) : null,
        employeeName ? String(employeeName) : null,
        Number(expense || 0),
        Number(wagePerPerson || 0),
        Number(headcount || 1),
        'In Progress'
      ]
    );

    if (stageName) {
      await db.query(
        `UPDATE workflow_bundles SET status = 'In Progress', current_stage = COALESCE($1, current_stage) WHERE id = $2`,
        [stageName, resolvedBundleId]
      );
    }

    res.status(201).json({ success: true, message: 'Employee assigned successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error in assignEmployeeToBundle:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 13. PATCH /api/workflows/bundles/assignments/:assignmentId/complete
export const completeBundleAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const result = await db.query(
      `UPDATE bundle_stage_assignments SET status = 'Completed' WHERE id = $1 RETURNING *`,
      [assignmentId]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error in completeBundleAssignment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};