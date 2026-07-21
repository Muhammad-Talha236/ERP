/**
 * workflowTemplates.mock.js — reusable workflow blueprints.
 * These are READ-ONLY reference data from the PO's perspective —
 * when a PO is created, its stages are COPIED into that PO's own
 * orderWorkflowSteps (see orderWorkflowSteps.mock.js), which can
 * then be edited independently without ever touching this template.
 *
 * @typedef {Object} TemplateStage
 * @property {string} id
 * @property {string} stageName
 * @property {number} stageOrder
 * @property {number} estimatedHours
 * @property {number} headcount
 * @property {number} wagePerUnit
 * @property {number} stageExpense
 *
 * @typedef {Object} WorkflowTemplate
 * @property {string} id
 * @property {string} templateName
 * @property {string} description
 * @property {boolean} isActive
 * @property {TemplateStage[]} stages
 */

export const workflowTemplatesMockData = [
  {
    id: 'wft-polo',
    templateName: 'Polo Shirt Production',
    description: 'Standard pipeline for polo shirts.',
    isActive: true,
    stages: [
      { id: 'stg-1', stageName: 'Material Allocation', stageOrder: 1, estimatedHours: 2, headcount: 2, wagePerUnit: 2, stageExpense: 200 },
      { id: 'stg-2', stageName: 'Cutting', stageOrder: 2, estimatedHours: 4, headcount: 3, wagePerUnit: 5, stageExpense: 500 },
      { id: 'stg-3', stageName: 'Stitching', stageOrder: 3, estimatedHours: 8, headcount: 8, wagePerUnit: 15, stageExpense: 1200 },
      { id: 'stg-4', stageName: 'Printing', stageOrder: 4, estimatedHours: 3, headcount: 2, wagePerUnit: 6, stageExpense: 350 },
      { id: 'stg-5', stageName: 'Quality Check', stageOrder: 5, estimatedHours: 2, headcount: 2, wagePerUnit: 3, stageExpense: 150 },
      { id: 'stg-6', stageName: 'Packaging', stageOrder: 6, estimatedHours: 2, headcount: 2, wagePerUnit: 3, stageExpense: 100 },
    ],
  },
  {
    id: 'wft-denim',
    templateName: 'Premium Denim Production',
    description: 'Heavy-duty pipeline for denim jeans/jackets.',
    isActive: true,
    stages: [
      { id: 'stg-7', stageName: 'Material Allocation', stageOrder: 1, estimatedHours: 3, headcount: 2, wagePerUnit: 3, stageExpense: 300 },
      { id: 'stg-8', stageName: 'Cutting', stageOrder: 2, estimatedHours: 5, headcount: 4, wagePerUnit: 12, stageExpense: 900 },
      { id: 'stg-9', stageName: 'Stitching', stageOrder: 3, estimatedHours: 12, headcount: 12, wagePerUnit: 22, stageExpense: 2000 },
      { id: 'stg-10', stageName: 'Stone Washing', stageOrder: 4, estimatedHours: 6, headcount: 3, wagePerUnit: 20, stageExpense: 1500 },
      { id: 'stg-11', stageName: 'Quality Check', stageOrder: 5, estimatedHours: 2, headcount: 2, wagePerUnit: 5, stageExpense: 200 },
      { id: 'stg-12', stageName: 'Packaging', stageOrder: 6, estimatedHours: 2, headcount: 2, wagePerUnit: 4, stageExpense: 150 },
    ],
  },
];