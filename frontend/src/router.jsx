import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { EmployeesPage } from '@/features/employees/EmployeesPage';
import { EmployeeRecordPage } from '@/features/employees/EmployeeRecordPage';
import { AttendancePage } from '@/features/attendence/AttendancePage';
import { MaterialsPage } from '@/features/materials/MaterialsPage';
/**
 * Root route — simple pass-through. Each page calls its own
 * <AppLayout title="..." subtitle="..."> individually.
 */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

/**
 * Temporary index route ("/") — placeholder until a real Dashboard
 * page exists (outside your assigned modules).
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
      <p className="text-text-secondary mt-2">Coming soon.</p>
    </div>
  ),
});

/**
 * /employees — the employee list/table page.
 */
const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: EmployeesPage,
});

/**
 * /employees/$employeeId — the individual employee detail page.
 *
 * IMPORTANT FIX: this is now a SIBLING of employeesRoute (both are
 * children of rootRoute), not a nested child of employeesRoute.
 *
 * Why: EmployeeRecordPage renders its own full <AppLayout> from
 * scratch — it's a completely independent page, not UI meant to
 * appear "inside" EmployeesPage. Nesting it under employeesRoute
 * would require EmployeesPage to render an <Outlet /> for the child
 * to display into, which it doesn't (and shouldn't) have.
 *
 * The full path '/employees/$employeeId' is written out directly
 * here since this route's parent is rootRoute, not employeesRoute.
 */
const employeeRecordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees/$employeeId',
  component: EmployeeRecordPage,
});
/**
 * /attendance — the Attendance module page.
 */
const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/attendance',
  component: AttendancePage,
});

/**
 * /materials — the Materials (Raw Material) module page.
 */
const materialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/materials',
  component: MaterialsPage,
});
const routeTree = rootRoute.addChildren([
  indexRoute,
  employeesRoute,
  employeeRecordRoute,
  attendanceRoute,
  materialsRoute,
]);

export const router = createRouter({ routeTree });