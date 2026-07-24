import { z } from 'zod';

/**
 * splitIntoBundlesSchema — validates the "Split into Bundles" form.
 * The admin specifies how many units go into EACH bundle; the
 * system computes how many bundles that creates from the order's
 * total quantity.
 */
export const splitIntoBundlesSchema = z.object({
  quantityPerBundle: z.coerce.number().positive('Must be greater than 0'),
});

/**
 * editBundleSchema — validates editing a single existing bundle
 * (just its quantity, since stage/employee are managed elsewhere
 * via "Log Movement").
 */
export const editBundleSchema = z.object({
  quantity: z.coerce.number().positive('Must be greater than 0'),
});