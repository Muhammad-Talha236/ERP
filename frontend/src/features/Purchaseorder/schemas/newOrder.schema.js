import { z } from 'zod';

export const newOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.coerce.number().min(0.01, 'Unit price must be greater than 0'),
  priority: z.enum(['Low', 'Medium', 'High']),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  workflowMode: z.enum(['existing', 'custom']),
  workflowTemplateId: z.string().optional(),

  // Custom stages ko optional ya lenient bana diya gaya hai taake validation fail na ho
  customStages: z.array(
    z.object({
      position: z.coerce.number().optional(),
      stageName: z.string().optional(),
      headcount: z.coerce.number().optional(),
      wagePerPerson: z.coerce.number().optional(),
      stageExpense: z.coerce.number().optional(),
      assignedEmployeeId: z.string().optional(),
    })
  ).optional(),
});