import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { EmployeesPage } from '@/features/employees/EmployeesPage';
import { EmployeeRecordPage } from '@/features/employees/EmployeeRecordPage';
import { AttendancePage } from '@/features/attendence/AttendancePage';
import { MaterialsPage } from '@/features/materials/MaterialsPage';
import { DailyUsagePage } from '@/features/daily-usage/DailyUsagePage';
import { WagesPage } from '@/features/wages/WagesPage';
import { PurchaseOrdersPage } from '@/features/purchase-orders/PurchaseOrdersPage';
import { ProductionPage } from '@/features/production/ProductionPage';
import { AccountsPage } from '@/features/accounts/AccountsPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { SuperAdminPage } from '@/features/super-admin/SuperAdminPage';



/**
 * Root route — simple pass-through. Each page calls its own
 * <AppLayout title="..." subtitle="..."> individually.
 */
const rootRoute = createRootRoute({ component: () => <Outlet /> });

// --- Public routes: no ProtectedRoute wrapper ---
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage });

const superAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/super-admin',
  component: () => <ProtectedRoute requiredRole="SuperAdmin"><SuperAdminPage /></ProtectedRoute>,
});

// --- Protected routes: every existing page now wrapped ---
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <ProtectedRoute><DashboardPage /></ProtectedRoute>,
});

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: () => <ProtectedRoute><EmployeesPage /></ProtectedRoute>,
});

const employeeRecordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees/$employeeId',
  component: () => <ProtectedRoute><EmployeeRecordPage /></ProtectedRoute>,
});

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/attendance',
  component: () => <ProtectedRoute><AttendancePage /></ProtectedRoute>,
});

const materialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/materials',
  component: () => <ProtectedRoute><MaterialsPage /></ProtectedRoute>,
});

const dailyUsageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-usage',
  component: () => <ProtectedRoute><DailyUsagePage /></ProtectedRoute>,
});

const wagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wages',
  component: () => <ProtectedRoute><WagesPage /></ProtectedRoute>,
});

const purchaseOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/Stock-orders',
  component: () => <ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute>,
});

const productionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/production',
  component: () => <ProtectedRoute><ProductionPage /></ProtectedRoute>,
});

const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounts',
  component: () => <ProtectedRoute><AccountsPage /></ProtectedRoute>,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
   superAdminRoute,
  indexRoute,
  employeesRoute,
  employeeRecordRoute,
  attendanceRoute,
  materialsRoute,
  dailyUsageRoute,
  wagesRoute,
  purchaseOrdersRoute,
  productionRoute,
  accountsRoute,
]);

export const router = createRouter({ routeTree });