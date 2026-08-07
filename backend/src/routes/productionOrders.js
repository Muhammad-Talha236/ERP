import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// GET /api/production-orders
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`po.status = $${paramIndex++}`);
      values.push(status);
    }

    if (search) {
      conditions.push(`(po.product_name ILIKE $${paramIndex} OR po.po_number ILIKE $${paramIndex} OR po.customer_name ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        po.id,
        po.po_number          AS "poNumber",
        po.customer_name       AS "customerName",
        po.product_name        AS "productName",
        po.quantity             AS "quantity",
        po.unit_price           AS "unitPrice",
        po.priority             AS "priority",
        po.status               AS "status",
        po.delivery_date        AS "deliveryDate",
        po.received_date        AS "receivedDate",
        po.current_stage_order  AS "currentStageOrder",
        po.tenant_id            AS "tenantId"
      FROM production_orders po
      ${whereClause}
      ORDER BY po.id DESC;
    `;

    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Database fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/production-orders
router.post('/', async (req, res) => {
  try {
    const {
      product_name,
      quantity,
      unit_price,
      status,
      tenant_id,
      po_number,
      customer_name,
      priority,
      delivery_date,
      current_stage_order,
      received_date,
      workflowMode,
      customStages,
    } = req.body;

    const query = `
      INSERT INTO production_orders 
      (product_name, quantity, unit_price, status, tenant_id, po_number, customer_name, priority, delivery_date, current_stage_order, received_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const generatedPoNumber = po_number || `PO-${Math.floor(1000 + Math.random() * 9000)}`;

    const values = [
      product_name,
      quantity,
      unit_price,
      status || 'Pending',
      tenant_id || 1,
      generatedPoNumber,
      customer_name || 'Walk-in Customer',
      priority,
      delivery_date,
      current_stage_order || 1,
      received_date || new Date().toISOString().split('T')[0],
    ];

    const result = await pool.query(query, values);
    const newOrder = result.rows[0];
    const poNumber = newOrder.po_number || generatedPoNumber;

    // Workflow stages tayyar karein (Custom ya Default)
    let stagesToSave;
    if (workflowMode === 'custom' && Array.isArray(customStages) && customStages.length > 0) {
      stagesToSave = customStages;
    } else {
      stagesToSave = [
        { stageName: 'Material Allocation', stageExpense: 0, wagePerPerson: 100, headcount: 1, position: 1 },
        { stageName: 'Cutting & Sizing', stageExpense: 50, wagePerPerson: 150, headcount: 2, position: 2 },
        { stageName: 'Assembly & Stitching', stageExpense: 100, wagePerPerson: 200, headcount: 3, position: 3 },
        { stageName: 'Quality Inspection', stageExpense: 20, wagePerPerson: 120, headcount: 1, position: 4 },
      ];
    }

    // Direct database mein stages insert karwa dein
    for (const [index, stage] of stagesToSave.entries()) {
      await pool.query(
        `INSERT INTO order_workflow_steps (po_number, stage_name, expense, wage_per_person, headcount, position)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
        [
          poNumber,
          stage.stageName || stage.name,
          stage.stageExpense || stage.expense || 0,
          stage.wagePerPerson || stage.wage || 0,
          stage.headcount || 1,
          stage.position || index + 1
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Production order created successfully with workflow steps',
      data: newOrder,
    });
  } catch (error) {
    console.error('Database insertion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/production-orders/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      quantity,
      unit_price,
      customer_name,
      priority,
      status,
      delivery_date,
    } = req.body;

    // Sirf wo fields update karein jo request me bheji gayi hain (partial update support,
    // e.g. sirf status change karne ke liye baaki fields bhejne ki zaroorat nahi)
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (product_name !== undefined) { fields.push(`product_name = $${paramIndex++}`); values.push(product_name); }
    if (quantity !== undefined) { fields.push(`quantity = $${paramIndex++}`); values.push(quantity); }
    if (unit_price !== undefined) { fields.push(`unit_price = $${paramIndex++}`); values.push(unit_price); }
    if (customer_name !== undefined) { fields.push(`customer_name = $${paramIndex++}`); values.push(customer_name); }
    if (priority !== undefined) { fields.push(`priority = $${paramIndex++}`); values.push(priority); }
    if (status !== undefined) { fields.push(`status = $${paramIndex++}`); values.push(status); }
    if (delivery_date !== undefined) { fields.push(`delivery_date = $${paramIndex++}`); values.push(delivery_date); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields provided to update' });
    }

    values.push(id);

    const query = `
      UPDATE production_orders
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Production order updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/production-orders/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM production_orders WHERE id = $1 RETURNING *;',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Production order deleted successfully',
    });
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;