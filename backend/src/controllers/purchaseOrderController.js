import { PurchaseOrder } from '../models/purchaseOrder.js';

export const createPurchaseOrder = async (req, res) => {
  try {
    const rawTenant = req.user?.tenant_id || req.user?.tenantId || req.headers['tenant-id'] || 1;
    const tenantId = typeof rawTenant === 'object' ? (rawTenant.id || 1) : rawTenant;
    
    const { supplierName, supplier_name, expectedDeliveryDate, expected_delivery_date, items } = req.body;
    const resolvedSupplier = supplierName || supplier_name;
    const resolvedDate = expectedDeliveryDate || expected_delivery_date || new Date().toISOString().split('T')[0];
    
    if (!resolvedSupplier || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Supplier name and at least one item are required.' });
    }
    
    const cleanData = {
      supplierName: resolvedSupplier,
      expectedDeliveryDate: resolvedDate,
      items,
    };
    
    const newPO = await PurchaseOrder.create(tenantId, cleanData);
    res.status(201).json({ success: true, data: newPO, po: newPO });
  } catch (err) {
    console.error('Create PO error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPurchaseOrders = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });
    const { status, search } = req.query;
    const purchaseOrders = await PurchaseOrder.findByTenant(tenantId, { status, search });
    res.json({ success: true, purchaseOrders });
  } catch (error) {
    console.error('Get POs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPurchaseOrderById = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const po = await PurchaseOrder.findById(req.params.id, tenantId);
    if (!po) return res.status(404).json({ message: 'Purchase order not found' });
    res.json({ success: true, po });
  } catch (error) {
    console.error('Get PO by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const po = await PurchaseOrder.update(req.params.id, tenantId, req.body);
    res.json({ success: true, message: 'Purchase order updated successfully', po });
  } catch (error) {
    console.error('Update PO error:', error);
    res.status(400).json({ success: false, message: error.message || 'Server error' });
  }
};

export const markAsReceived = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const po = await PurchaseOrder.markAsReceived(req.params.id, tenantId);
    if (!po) return res.status(404).json({ message: 'Purchase order not found' });
    res.json({ success: true, message: 'Purchase order marked as received', po });
  } catch (error) {
    console.error('Mark received error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { amount, type, remarks } = req.body;
    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0 || !type) {
      return res.status(400).json({ success: false, message: 'Valid amount and type are required' });
    }

    const result = await PurchaseOrder.recordPayment(req.params.id, tenantId, { 
      amount: parsedAmount, 
      type, 
      remarks 
    });
    
    res.status(201).json({ success: true, message: 'Payment recorded successfully', ...result });
  } catch (error) {
    console.error('Record PO payment error:', error);
    res.status(400).json({ success: false, message: error.message || 'Server error' });
  }
};

export const updatePOPayment = async (req, res) => {
  try {
    const tenantId = req.user.tenant_id;
    const { amount, type, remarks } = req.body;
    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const result = await PurchaseOrder.updatePayment(req.params.transactionId, tenantId, {
      amount: parsedAmount,
      type,
      remarks,
    });
    res.json({ success: true, message: 'PO Payment updated successfully', ...result });
  } catch (error) {
    console.error('Update PO payment error:', error);
    res.status(400).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const history = await PurchaseOrder.fetchPaymentHistory(req.params.id);
    res.json({ success: true, history });
  } catch (error) {
    console.error('Get PO payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};