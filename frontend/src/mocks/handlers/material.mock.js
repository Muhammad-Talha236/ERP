import { materialsMockData } from '@/mocks/data/materials.mock';

const DELAY_MS = 350;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let materials = [...materialsMockData];

/**
 * Simulates GET /api/v1/raw-materials
 * Supports ?search= and ?stock=low per the documented API.
 *
 * @param {{ search?: string, stock?: 'low' }} params
 * @returns {Promise<Material[]>}
 */
export async function fetchMaterials(params = {}) {
  await wait(DELAY_MS);

  let result = [...materials];

  if (params.search) {
    const query = params.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.materialName.toLowerCase().includes(query) ||
        m.materialCode.toLowerCase().includes(query)
    );
  }

  if (params.stock === 'low') {
    result = result.filter((m) => m.currentStock < m.minimumStock);
  }

  return result;
}

/**
 * Simulates POST /api/v1/raw-materials
 * @param {Omit<Material, 'id'|'lastUpdated'>} newMaterial
 * @returns {Promise<Material>}
 */
export async function createMaterial(newMaterial) {
  await wait(DELAY_MS);

  const material = {
    id: `mat-${Date.now()}`,
    lastUpdated: new Date().toISOString(),
    ...newMaterial,
  };

  materials = [material, ...materials];
  return material;
}

/**
 * Simulates PUT /api/v1/raw-materials/{id}
 * @param {string} id
 * @param {Partial<Material>} updates
 * @returns {Promise<Material>}
 */
export async function updateMaterial(id, updates) {
  await wait(DELAY_MS);

  materials = materials.map((m) =>
    m.id === id ? { ...m, ...updates, lastUpdated: new Date().toISOString() } : m
  );

  return materials.find((m) => m.id === id);
}

/**
 * Simulates DELETE /api/v1/raw-materials/{id}
 * @param {string} id
 * @returns {Promise<{ id: string }>}
 */
export async function deleteMaterial(id) {
  await wait(DELAY_MS);
  materials = materials.filter((m) => m.id !== id);
  return { id };
}