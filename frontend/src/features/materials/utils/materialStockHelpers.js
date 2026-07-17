/**
 * materialStockHelpers.js — small, reusable calculations for
 * material stock levels, kept in the materials feature folder
 * since "what counts as low stock" is business logic specific
 * to this module.
 */

/**
 * isLowStock — a material is "low" when current stock has fallen
 * below its configured minimum threshold.
 * @param {Material} material
 * @returns {boolean}
 */
export function isLowStock(material) {
  return material.currentStock < material.minimumStock;
}

/**
 * getStockProgressPercent — how full the stock bar should render,
 * relative to minimumStock as a baseline reference point (not a
 * hard max — minimumStock * 2 is used as a reasonable "full" target
 * so the bar has visual room to show above-minimum stock levels too).
 * Clamped to 100 so overstocked materials don't overflow the bar.
 *
 * @param {Material} material
 * @returns {number} 0–100
 */
export function getStockProgressPercent(material) {
  if (material.minimumStock === 0) return 100;
  const target = material.minimumStock * 2;
  const percent = (material.currentStock / target) * 100;
  return Math.min(100, Math.round(percent));
}

/**
 * getStockBarColor — red when below minimum, blue otherwise,
 * matching the screenshot's progress bar colors exactly.
 * @param {Material} material
 * @returns {'bg-danger'|'bg-primary'}
 */
export function getStockBarColor(material) {
  return isLowStock(material) ? 'bg-danger' : 'bg-primary';
}