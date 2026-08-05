/**
 * computeStageBreakdown — for one order, figures out PER STAGE
 * which specific bundles are "in" (currently there) vs "out"
 * (already moved past it), by NAME — not just a count.
 *
 * @param {OrderWorkflowStep[]} steps
 * @param {ProductionBundle[]} bundles
 * @returns {Array<{ stageName, stageOrder, inBundles: ProductionBundle[], outBundles: ProductionBundle[] }>}
 *          Only stages with at least one bundle in/out are included.
 */
export function computeStageBreakdown(steps, bundles) {
  const sortedSteps = [...steps].sort((a, b) => a.stageOrder - b.stageOrder);

  const breakdown = sortedSteps.map((step) => {
    const inBundles = bundles.filter(
      (b) => b.status !== 'Completed' && b.currentStageOrder === step.stageOrder
    );
    const outBundles = bundles.filter(
      (b) => b.status === 'Completed' || b.currentStageOrder > step.stageOrder
    );

    return { stageName: step.stageName, stageOrder: step.stageOrder, inBundles, outBundles };
  });

  return breakdown.filter((s) => s.inBundles.length > 0 || s.outBundles.length > 0);
}