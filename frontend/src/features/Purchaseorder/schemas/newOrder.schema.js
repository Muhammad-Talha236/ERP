import { z } from 'zod';

/**
 * customStageSchema — one stage row when the user builds a custom
 * workflow for this order (instead of picking an existing template).
 * `position` is what the user directly controls to reorder — the
 * array gets sorted by this number, not by array insertion order.
 */
const customStageSchema = z.object({
  position: z.coerce.number().int().positive('Position must be 1 or higher'),
  stageName: z.string().min(1, 'Stage name is required'),
  headcount: z.coerce.number().positive('Must be greater than 0'),
  wagePerPerson: z.coerce.number().min(0, 'Must be 0 or greater'),
  stageExpense: z.coerce.number().min(0, 'Must be 0 or greater'),
});

/**
 * newOrderSchema — validates the New Order form. `workflowMode`
 * decides which of the two mutually exclusive paths is required:
 * an existing template ID, or a custom-built stage list.
 */
export const newOrderSchema = z
  .object({
    customerId: z.string().min(1, 'Select a customer'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.coerce.number().positive('Quantity must be greater than 0'),
    unitPrice: z.coerce.number().min(0, 'Unit price must be 0 or greater'),
    priority: z.enum(['Low', 'Medium', 'High']),
    deliveryDate: z.string().min(1, 'Delivery date is required'),
    workflowMode: z.enum(['existing', 'custom']),
    workflowTemplateId: z.string().optional(),
    customStages: z.array(customStageSchema).optional(),
  })
  .refine((data) => data.workflowMode !== 'existing' || Boolean(data.workflowTemplateId), {
    message: 'Select a workflow template',
    path: ['workflowTemplateId'],
  })
  .refine((data) => data.workflowMode !== 'custom' || (data.customStages && data.customStages.length > 0), {
    message: 'Add at least one stage',
    path: ['customStages'],
  });