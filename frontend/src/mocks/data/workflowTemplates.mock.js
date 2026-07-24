export const workflowTemplatesMockData = [
  {
    id: 'wft-polo',
    templateName: 'Polo Shirt Production',
    description: 'Standard pipeline for polo shirts.',
    isActive: true,
    stages: [
      { id: 'stg-1', stageName: 'Material Allocation', stageOrder: 1, estimatedHours: 2, headcount: 2, wagePerPerson: 200, stageExpense: 200 },
      { id: 'stg-2', stageName: 'Cutting', stageOrder: 2, estimatedHours: 4, headcount: 3, wagePerPerson: 350, stageExpense: 500 },
      { id: 'stg-3', stageName: 'Stitching', stageOrder: 3, estimatedHours: 8, headcount: 8, wagePerPerson: 600, stageExpense: 1200 },
      { id: 'stg-4', stageName: 'Printing', stageOrder: 4, estimatedHours: 3, headcount: 2, wagePerPerson: 300, stageExpense: 350 },
      { id: 'stg-5', stageName: 'Quality Check', stageOrder: 5, estimatedHours: 2, headcount: 2, wagePerPerson: 150, stageExpense: 150 },
      { id: 'stg-6', stageName: 'Packaging', stageOrder: 6, estimatedHours: 2, headcount: 2, wagePerPerson: 120, stageExpense: 100 },
    ],
  },
  {
    id: 'wft-denim',
    templateName: 'Premium Denim Production',
    description: 'Heavy-duty pipeline for denim jeans/jackets.',
    isActive: true,
    stages: [
      { id: 'stg-7', stageName: 'Material Allocation', stageOrder: 1, estimatedHours: 3, headcount: 2, wagePerPerson: 250, stageExpense: 300 },
      { id: 'stg-8', stageName: 'Cutting', stageOrder: 2, estimatedHours: 5, headcount: 4, wagePerPerson: 450, stageExpense: 900 },
      { id: 'stg-9', stageName: 'Stitching', stageOrder: 3, estimatedHours: 12, headcount: 12, wagePerPerson: 800, stageExpense: 2000 },
      { id: 'stg-10', stageName: 'Stone Washing', stageOrder: 4, estimatedHours: 6, headcount: 3, wagePerPerson: 700, stageExpense: 1500 },
      { id: 'stg-11', stageName: 'Quality Check', stageOrder: 5, estimatedHours: 2, headcount: 2, wagePerPerson: 200, stageExpense: 200 },
      { id: 'stg-12', stageName: 'Packaging', stageOrder: 6, estimatedHours: 2, headcount: 2, wagePerPerson: 150, stageExpense: 150 },
    ],
  },
];