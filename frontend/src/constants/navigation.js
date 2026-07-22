import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Package,
  Factory,
  Activity,
  ShoppingCart,
  KanbanSquare,
  Wallet,
  Landmark,
  BarChart3,
  Settings,
} from 'lucide-react';

/**
 * NAV_ITEMS — the single source of truth for sidebar navigation.
 *
 * Each entry:
 *  - label: text shown in the sidebar
 *  - path: route path (matches TanStack Router route definitions)
 *  - icon: Lucide icon component reference (not JSX yet — Sidebar
 *          renders it as <Icon /> so we can size/style it consistently)
 *  - module: which team member's module this belongs to — purely
 *            informational for now, useful if we ever want to
 *            filter/group the sidebar by module later.
 *
 * NOTE: This list covers the WHOLE app's navigation, not just your
 * modules, since Sidebar is a shared layout component every page uses.
 * Routes not yet built (e.g. /production) will simply not have a
 * matching page until that teammate finishes their module.
 */
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, module: 'shared' },
  { label: 'Employees', path: '/employees', icon: Users, module: 'workforce' },
  { label: 'Attendance', path: '/attendance', icon: ClipboardCheck, module: 'workforce' },
  { label: 'Materials', path: '/materials', icon: Package, module: 'inventory' },
  { label: 'Production', path: '/production', icon: Factory, module: 'production' },
  { label: 'Daily Usage', path: '/daily-usage', icon: Activity, module: 'inventory' },
  { label: 'Stock Orders', path: '/Stock-orders', icon: ShoppingCart, module: 'production' },
  { label: 'Wages', path: '/wages', icon: Wallet, module: 'workforce' },
  { label: 'Accounts', path: '/accounts', icon: Landmark, module: 'finance' },
  { label: 'Reports', path: '/reports', icon: BarChart3, module: 'shared' },
  { label: 'Settings', path: '/settings', icon: Settings, module: 'shared' },
];