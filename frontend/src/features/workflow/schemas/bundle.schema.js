import { z } from 'zod';

/** Creates a new bundle by carving quantity out of an existing one. */
export const createBundleSchema = z.object({
  sourceBundleId: z.string().min(1, 'Select a bundle to split from'),
  quantity: z
    .preprocess(
      (val) => (val === '' || val === null ? undefined : Number(val)),
      z
        .number({ required_error: 'Quantity is required', invalid_type_error: 'Quantity must be a valid number' })
        .int('Quantity must be a whole number')
        .positive('Quantity must be greater than 0')
    ),
});

export const createInitialBundleSchema = z.object({
  quantity: z
    .preprocess(
      (val) => (val === '' || val === null ? undefined : Number(val)),
      z
        .number({ required_error: 'Quantity is required', invalid_type_error: 'Quantity must be a valid number' })
        .int('Quantity must be a whole number')
        .positive('Quantity must be greater than 0')
    ),
});

export const editBundleSchema = z.object({
  quantity: z
    .preprocess(
      (val) => (val === '' || val === null ? undefined : Number(val)),
      z
        .number({ required_error: 'Quantity is required', invalid_type_error: 'Quantity must be a valid number' })
        .int('Quantity must be a whole number')
        .positive('Quantity must be greater than 0')
    ),
});