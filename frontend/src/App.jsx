import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

/**
 * App — the root component of the entire application.
 *
 * Deliberately minimal: all provider setup (React Query) lives in
 * main.jsx, all route definitions live in router.jsx. This file's
 * only responsibility is connecting React to the router.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;