import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarLink } from './SidebarLink';
import { useCurrentUser, useAuthStore } from '@/store/authStore';

/**
 * Sidebar — fixed left navigation panel.
 *
 * Footer now shows the REAL logged-in user (from authStore) instead
 * of a hardcoded placeholder, plus a functional Logout button.
 */
export function Sidebar() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?';

  return (
    <aside className="flex flex-col h-screen w-[280px] bg-background border-r border-border shrink-0">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="w-10 h-10 rounded-input bg-primary flex items-center justify-center shrink-0">
          <Settings size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary leading-tight">NorthForge</p>
          <p className="text-xs text-text-secondary leading-tight">Factory OS</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Workspace
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.path} to={item.path} icon={item.icon} label={item.label} />
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 px-4 py-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary truncate">
            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
          </p>
          <p className="text-xs text-text-secondary truncate">{user?.role === 'SuperAdmin' ? 'Super Admin' : 'Plant Manager'}</p>
        </div>
        <button onClick={handleLogout} className="text-text-secondary hover:text-danger transition-colors shrink-0" aria-label="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}