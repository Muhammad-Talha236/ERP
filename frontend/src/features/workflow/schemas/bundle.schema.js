import { z } from 'zod';

/** Creates a new bundle by carving quantity out of an existing one. */
export const createBundleSchema = z.object({
  sourceBundleId: z.string().min(1, 'Select a bundle to split from'),
  quantity: z.coerce.number().positive('Must be greater than 0'),
});

export const editBundleSchema = z.object({
  quantity: z.coerce.number().positive('Must be greater than 0'),
});