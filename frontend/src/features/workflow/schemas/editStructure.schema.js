import { z } from 'zod';

/**
 * editStructureSchema — validates editing an order's stage
 * STRUCTURE (add/remove/rename/reposition).
 */
export const editStructureSchema = z.object({
  steps: z
    .array(
      z.object({
        id: z.string().optional(),
        
        // Position: Integer required, minimum 1 (prevents <= 0)
        position: z.coerce
          .number({ invalid_type_error: 'Position is required' })
          .int('Position must be a whole number')
          .min(1, 'Position must be 1 or higher'),

        // Stage Name: Trimmed string, cannot be empty or space-only
        stageName: z
          .string()
          .trim()
          .min(1, 'Stage name is required'),

        // Headcount: Integer required, minimum 1 person
        headcount: z.coerce
          .number({ invalid_type_error: 'Headcount is required' })
          .int('Headcount must be a whole number')
          .min(1, 'Headcount must be at least 1'),

        // Wage: Decimal allowed, minimum 0
        wagePerPerson: z.coerce
          .number({ invalid_type_error: 'Wage is required' })
          .min(0, 'Wage must be 0 or greater'),

        // Expense: Decimal allowed, minimum 0
        expense: z.coerce
          .number({ invalid_type_error: 'Expense is required' })
          .min(0, 'Expense must be 0 or greater'),
      })
    )
    .min(1, 'At least one stage is required'),
});