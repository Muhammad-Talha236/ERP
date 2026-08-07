import { z } from 'zod';

export const createTemplateSchema = z.object({
  templateName: z.string().trim().min(1, 'Template name is required'),
  customStages: z
    .array(
      z.object({
        position: z.coerce.number().optional(),
        stageName: z.string().trim().min(1, 'Stage name is required'),
        headcount: z.coerce.number().min(1, 'Headcount must be at least 1'),
        wagePerPerson: z.coerce.number().min(0, 'Wage must be 0 or greater'),
        stageExpense: z.coerce.number().min(0, 'Expense must be 0 or greater'),
        assignedEmployeeId: z.string().optional(),
      })
    )
    .min(1, 'At least one stage is required'),
});