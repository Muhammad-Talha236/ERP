import { pool } from '../config/database.js';

const mapPORow = (row, items = []) => {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenant_id,
    poNumber: row.po_number,
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    items,
    totalAmount: row.total_amount !== null ? parseFloat(row.total_amount) : 0,
    paidAmount: row.paid_amount !== null ? parseFloat(row.paid_amount) : 0,
    status: row.status,
    paymentStatus: row.payment_status,
    createdDate: row.created_date,
    expectedDeliveryDate: row.expected_delivery_date,
    receivedDate: row.received_date,
  };
};

function derivePaymentStatus(paid, total) {
  if (paid <= 0) return 'Unpaid';
  if (paid >= total) return 'Paid';
  return 'Partial';
}

async function fetchItems(poId) {
  const result = await pool.query(
    'SELECT * FROM purchase_order_items WHERE purchase_order_id = $1',
    [poId]
  );
  return result.rows.map((r) => ({
    id: r.id,
    materialId: r.material_id,
    materialName: r.material_name,
    quantity: parseFloat(r.quantity),
    unitPrice: parseFloat(r.unit_price),
  }));
}

export const PurchaseOrder = {
  create: async (tenantId, data) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { supplierName, expectedDeliveryDate, items } = data;
      const tIdStr = String(tenantId && typeof tenantId === 'object' ? (tenantId.id || 1) : (tenantId || 1));

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const poNumber = `PUR-${Date.now().toString().slice(-4)}${randomNum}`;

      let totalAmount = 0;
      if (items && Array.isArray(items)) {
        totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0);
      }

      const poRes = await client.query(
        `INSERT INTO purchase_orders (tenant_id, po_number, supplier_name, expected_delivery_date, total_amount, paid_amount, status, payment_status, created_date)
         VALUES ($1, $2, $3, $4, $5, 0, 'Draft', 'Unpaid', CURRENT_DATE) RETURNING *`,
        [tIdStr, poNumber, supplierName, expectedDeliveryDate, totalAmount]
      );

      const newPo = poRes.rows[0];

      if (items && Array.isArray(items)) {
        for (const item of items) {
          await client.query(
            `INSERT INTO purchase_order_items (purchase_order_id, material_name, quantity, unit_price)
             VALUES ($1, $2, $3, $4)`,
            [newPo.id, item.materialName || item.material_name, Number(item.quantity || 1), Number(item.unitPrice || 0)]
          );
        }
      }

      await client.query('COMMIT');
      const itemsList = await fetchItems(newPo.id);
      return mapPORow(newPo, itemsList);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  findByTenant: async (tenantId, filters = {}) => {
    const { status, search } = filters;
    let query = 'SELECT * FROM purchase_orders WHERE tenant_id = $1';
    const values = [tenantId];
    let i = 2;

    if (status && status.toLowerCase() !== 'all') {
      query += ` AND status = $${i}`;
      values.push(status);
      i++;
    }
    if (search) {
      query += ` AND (po_number ILIKE $${i} OR supplier_name ILIKE $${i})`;
      values.push(`%${search}%`);
      i++;
    }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    const pos = [];
    for (const row of result.rows) {
      const items = await fetchItems(row.id);
      pos.push(mapPORow(row, items));
    }
    return pos;
  },

  findById: async (id, tenantId) => {
    const result = await pool.query('SELECT * FROM purchase_orders WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
    if (!result.rows[0]) return null;
    const items = await fetchItems(id);
    return mapPORow(result.rows[0], items);
  },

  update: async (id, tenantId, updates) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { supplierName, expectedDeliveryDate, items } = updates;
      let totalAmount = null;

      if (items) {
        await client.query('DELETE FROM purchase_order_items WHERE purchase_order_id = $1', [id]);
        totalAmount = items.reduce((sum, it) => sum + Number(it.quantity) * Number(it.unitPrice), 0);
        for (const item of items) {
          await client.query(
            `INSERT INTO purchase_order_items (purchase_order_id, material_name, quantity, unit_price)
             VALUES ($1,$2,$3,$4)`,
            [id, item.materialName || item.material_name, item.quantity, item.unitPrice]
          );
        }
      }

      const poRes = await client.query('SELECT * FROM purchase_orders WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
      const existing = poRes.rows[0];
      if (!existing) throw new Error('Purchase order not found.');

      const finalTotal = totalAmount !== null ? totalAmount : parseFloat(existing.total_amount);
      const paymentStatus = derivePaymentStatus(parseFloat(existing.paid_amount), finalTotal);

      const updatedRes = await client.query(
        `UPDATE purchase_orders
         SET supplier_name = COALESCE($1, supplier_name),
             expected_delivery_date = COALESCE($2, expected_delivery_date),
             total_amount = $3,
             payment_status = $4
         WHERE id = $5
         RETURNING *`,
        [supplierName, expectedDeliveryDate, finalTotal, paymentStatus, id]
      );

      await client.query('COMMIT');
      const items2 = await fetchItems(id);
      return mapPORow(updatedRes.rows[0], items2);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  markAsReceived: async (id, tenantId) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const poRes = await client.query('SELECT * FROM purchase_orders WHERE id = $1', [id]);
      if (poRes.rows.length === 0) {
        throw new Error('Purchase order not found.');
      }
      const po = poRes.rows[0];

      if (po.status === 'Received') {
        throw new Error('This purchase order has already been marked as received.');
      }

      const itemsRes = await client.query('SELECT * FROM purchase_order_items WHERE purchase_order_id = $1', [id]);
      const items = itemsRes.rows;

      for (const item of items) {
        const matName = item.material_name;
        const qtyToAdd = parseFloat(item.quantity || 0);

        const matCheck = await client.query(
          'SELECT id, current_stock FROM materials WHERE material_name ILIKE $1 OR material_code ILIKE $1 FOR UPDATE',
          [matName]
        );

        if (matCheck.rows.length > 0) {
          const matId = matCheck.rows[0].id;
          await client.query(
            'UPDATE materials SET current_stock = current_stock + $1 WHERE id = $2',
            [qtyToAdd, matId]
          );
        } else {
          await client.query(
            `INSERT INTO materials (tenant_id, material_code, material_name, category, unit, current_stock, minimum_stock, purchase_price, status, supplier_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', $9)`,
            [
              po.tenant_id || 1,
              `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
              matName,
              'General',
              'Piece',
              qtyToAdd,
              10,
              item.unit_price || 0,
              po.supplier_name || 'Supplier'
            ]
          );
        }
      }

      const updatedPoRes = await client.query(
        `UPDATE purchase_orders 
         SET status = 'Received', received_date = CURRENT_DATE 
         WHERE id = $1 RETURNING *`,
        [id]
      );

      await client.query('COMMIT');
      const finalItems = await fetchItems(id);
      return mapPORow(updatedPoRes.rows[0], finalItems);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  fetchPaymentHistory: async (poId) => {
    const result = await pool.query(
      'SELECT * FROM po_payments WHERE purchase_order_id = $1 ORDER BY payment_date DESC, created_at DESC',
      [poId]
    );
    return result.rows.map((r) => ({
      id: r.id,
      poId: r.purchase_order_id,
      type: r.payment_type,
      amount: parseFloat(r.amount),
      date: r.payment_date,
      remarks: r.remarks,
    }));
  },

  recordPayment: async (poId, paymentData) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { amount, type, remarks } = paymentData;
      const payAmount = Number(amount);

      const poRes = await client.query('SELECT * FROM purchase_orders WHERE id = $1 FOR UPDATE', [poId]);
      if (poRes.rows.length === 0) throw new Error('Purchase order not found.');
      const po = poRes.rows[0];

      const totalAmount = Number(po.total_amount);
      const currentPaid = Number(po.paid_amount || 0);
      const remaining = totalAmount - currentPaid;

      if (payAmount > remaining) {
        throw new Error(`Payment amount cannot exceed remaining balance of $${remaining}.`);
      }

      const newPaidAmount = currentPaid + payAmount;
      const paymentStatus = derivePaymentStatus(newPaidAmount, totalAmount);

      await client.query(
        `UPDATE purchase_orders SET paid_amount = $1, payment_status = $2 WHERE id = $3`,
        [newPaidAmount, paymentStatus, poId]
      );

      const txRes = await client.query(
        `INSERT INTO po_payments (purchase_order_id, payment_type, amount, payment_date, remarks)
         VALUES ($1, $2, $3, CURRENT_DATE, $4) RETURNING *`,
        [poId, type || 'Payment', payAmount, remarks || null]
      );

      const updatedPoRes = await client.query('SELECT * FROM purchase_orders WHERE id = $1', [poId]);
      
      // Separate pool query ki bajaye usi active client se items fetch karein taaki timeout na ho
      const itemsRes = await client.query('SELECT * FROM purchase_order_items WHERE purchase_order_id = $1', [poId]);
      const items = itemsRes.rows.map((r) => ({
        id: r.id,
        materialId: r.material_id,
        materialName: r.material_name,
        quantity: parseFloat(r.quantity),
        unitPrice: parseFloat(r.unit_price),
      }));

      await client.query('COMMIT');
      return { 
        po: mapPORow(updatedPoRes.rows[0], items), 
        transaction: {
          id: txRes.rows[0].id,
          poId: txRes.rows[0].purchase_order_id,
          type: txRes.rows[0].payment_type,
          amount: parseFloat(txRes.rows[0].amount),
          date: txRes.rows[0].payment_date,
          remarks: txRes.rows[0].remarks,
        } 
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
  updatePayment: async (transactionId, tenantId, updates) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const txRes = await client.query('SELECT * FROM po_payments WHERE id = $1 FOR UPDATE', [transactionId]);
      if (txRes.rows.length === 0) throw new Error('Payment record not found.');
      const transaction = txRes.rows[0];

      const poRes = await client.query(
        'SELECT * FROM purchase_orders WHERE id = $1 AND tenant_id = $2 FOR UPDATE',
        [transaction.purchase_order_id, tenantId]
      );
      if (poRes.rows.length === 0) throw new Error('Purchase order not found.');
      const po = poRes.rows[0];

      const totalAmount = parseFloat(po.total_amount);
      const currentPaid = parseFloat(po.paid_amount || 0);
      const oldAmount = parseFloat(transaction.amount);
      const newAmount = Number(updates.amount);
      const diff = newAmount - oldAmount;
      const newPaidAmount = currentPaid + diff;

      if (newPaidAmount < 0) throw new Error('Total paid amount cannot be negative.');
      if (newPaidAmount > totalAmount) throw new Error(`Total paid cannot exceed order total of $${totalAmount}.`);

      const newStatus = derivePaymentStatus(newPaidAmount, totalAmount);

      await client.query(
        `UPDATE po_payments SET amount = $1, remarks = COALESCE($2, remarks), payment_type = COALESCE($3, payment_type) WHERE id = $4`,
        [newAmount, updates.remarks, updates.type, transactionId]
      );

      const updatedPoRes = await client.query(
        `UPDATE purchase_orders SET paid_amount = $1, payment_status = $2 WHERE id = $3 RETURNING *`,
        [newPaidAmount, newStatus, po.id]
      );

      const updatedTxRes = await client.query('SELECT * FROM po_payments WHERE id = $1', [transactionId]);
      const items = await fetchItems(po.id);

      await client.query('COMMIT');
      return { 
        po: mapPORow(updatedPoRes.rows[0], items), 
        transaction: {
          id: updatedTxRes.rows[0].id,
          poId: updatedTxRes.rows[0].purchase_order_id,
          type: updatedTxRes.rows[0].payment_type,
          amount: parseFloat(updatedTxRes.rows[0].amount),
          date: updatedTxRes.rows[0].payment_date,
          remarks: updatedTxRes.rows[0].remarks,
        } 
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};