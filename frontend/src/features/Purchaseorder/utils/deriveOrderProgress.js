/**
 * deriveOrderProgress — computes an order's overall status and
 * current stage purely from its own workflow steps' completion state.
 *
 * Rules:
 *  - No steps completed at all -> 'Pending'
 *  - All steps completed -> 'Completed'
 *  - Otherwise, find the first NOT completed step (in stage order):
 *      - if that step is literally named "Quality Check" -> 'Quality Check'
 *      - otherwise -> 'In Progress'
 *
 * This keeps the Kanban board's 4 columns (Pending/In Progress/
 * Quality Check/Completed) meaningful without hardcoding stage
 * numbers — it works for ANY workflow template as long as one of
 * its stages is named "Quality Check", which all our templates have.
 *
 * @param {OrderWorkflowStep[]} steps
 * @returns {{ status: string, currentStageOrder: number }}
 */
export function deriveOrderProgress(steps) {
  const sorted = [...steps].sort((a, b) => a.stageOrder - b.stageOrder);

  const allCompleted = sorted.every((s) => s.status === 'Completed');
  if (allCompleted) {
    return { status: 'Completed', currentStageOrder: sorted[sorted.length - 1]?.stageOrder ?? 1 };
  }

  const noneStarted = sorted.every((s) => s.status === 'Not Started');
  if (noneStarted) {
    return { status: 'Pending', currentStageOrder: 1 };
  }

  const firstIncomplete = sorted.find((s) => s.status !== 'Completed');
  const status = firstIncomplete?.stageName === 'Quality Check' ? 'Quality Check' : 'In Progress';

  return { status, currentStageOrder: firstIncomplete?.stageOrder ?? 1 };
}