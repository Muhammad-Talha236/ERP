import { z } from 'zod';

/**
 * editStructureSchema — validates editing an order's stage
 * STRUCTURE (add/remove/rename/reposition), as opposed to editing
 * an existing step's expense/wage/headcount numbers.
 *
 * Only usable when an order hasn't started yet (all steps still
 * "Not Started") — enforced by the calling component, not here.
 */
export const editStructureSchema = z.object({
  steps: z
    .array(
      z.object({
        id: z.string().optional(), // present for existing steps, absent for newly-added ones
        position: z.coerce.number().int().positive('Position must be 1 or higher'),
        stageName: z.string().min(1, 'Stage name is required'),
        headcount: z.coerce.number().positive('Must be greater than 0'),
        wagePerPerson: z.coerce.number().min(0, 'Must be 0 or greater'),
        expense: z.coerce.number().min(0, 'Must be 0 or greater'),
      })
    )
    .min(1, 'At least one stage is required'),
});