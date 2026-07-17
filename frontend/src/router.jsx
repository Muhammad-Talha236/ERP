import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { EmployeesPage } from '@/features/employees/EmployeesPage';

/**
 * Root route — now a simple pass-through. AppLayout is no longer
 * applied globally here; instead, each page component calls
 * <AppLayout title="..." subtitle="..."> itself, since the header's
 * title/subtitle differ per page. This keeps AppLayout usage
 * explicit and co-located with the page that needs it.
 */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

/**
 * Temporary index route ("/") — will later redirect to a real
 * Dashboard page. Left as a simple placeholder for now since
 * Dashboard isn't part of your assigned modules.
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="p-lg">
      <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
      <p className="text-text-secondary mt-2">Coming soon.</p>
    </div>
  ),
});

/**
 * /employees — renders the real Employees module page.
 */
const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: EmployeesPage,
});

const routeTree = rootRoute.addChildren([indexRoute, employeesRoute]);

export const router = createRouter({ routeTree });