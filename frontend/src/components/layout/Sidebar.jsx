import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarLink } from './SidebarLink';
import { useCurrentUser, useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

/**
 * Sidebar — fixed left navigation panel.
 *
 * FIX: now actually reads isSidebarCollapsed from uiStore (the
 * Header's toggle button was already wired to this state, but
 * Sidebar never consumed it before). When collapsed:
 *  - width shrinks from 280px to 80px (matches the UI doc's spec)
 *  - text labels are hidden, only icons remain
 *  - the user footer shows just the avatar, no name/role text
 */
export function Sidebar() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);
  const isCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?';

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-background border-r border-border shrink-0 transition-all duration-200',
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      )}
    >
      <div className={cn('flex items-center gap-3 px-4 py-5', isCollapsed && 'justify-center px-0')}>
        <div className="w-10 h-10 rounded-input bg-primary flex items-center justify-center shrink-0">
          <Settings size={20} className="text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <p className="text-sm font-bold text-text-primary leading-tight">NorthForge</p>
            <p className="text-xs text-text-secondary leading-tight">Factory OS</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {!isCollapsed && (
          <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Workspace
          </p>
        )}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              collapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      <div className={cn('flex items-center gap-3 px-4 py-4 border-t border-border', isCollapsed && 'justify-center px-0')}>
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>
        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {user?.role === 'SuperAdmin' ? 'Super Admin' : 'Plant Manager'}
              </p>
            </div>
            <button onClick={handleLogout} className="text-text-secondary hover:text-danger transition-colors shrink-0" aria-label="Logout">
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}