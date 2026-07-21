import { tasksMockData } from '@/mocks/data/tasks.mock';

const DELAY_MS = 300;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let tasks = [...tasksMockData];

/**
 * Simulates GET /api/v1/tasks
 * @returns {Promise<Task[]>}
 */
export async function fetchTasks() {
  await wait(DELAY_MS);
  return [...tasks];
}

/**
 * Simulates POST /api/v1/tasks
 * @param {Omit<Task, 'id'|'taskNumber'|'commentCount'>} newTask
 * @returns {Promise<Task>}
 */
export async function createTask(newTask) {
  await wait(DELAY_MS);

  const task = {
    id: `task-${Date.now()}`,
    taskNumber: `T-${tasks.length + 1}`,
    commentCount: 0,
    status: 'To Do',
    ...newTask,
  };

  tasks = [...tasks, task];
  return task;
}

/**
 * Simulates PATCH /api/v1/tasks/{id}/status — used when a card is
 * dragged to a different column.
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Task>}
 */
export async function updateTaskStatus(id, status) {
  await wait(250);

  tasks = tasks.map((t) => (t.id === id ? { ...t, status } : t));
  return tasks.find((t) => t.id === id);
}

/**
 * Simulates DELETE /api/v1/tasks/{id}
 * @param {string} id
 */
export async function deleteTask(id) {
  await wait(250);
  tasks = tasks.filter((t) => t.id !== id);
  return { id };
}