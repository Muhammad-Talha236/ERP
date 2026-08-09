import { useState } from 'react';
import { Settings, LogOut, UserCircle, X } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarLink } from './SidebarLink';
import { useCurrentUser, useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Modal } from '@/components/ui/Modal';

/**
 * Sidebar — fixed left navigation panel.
 *
 * Desktop/tablet (md and up, >=768px): normal in-flow sidebar,
 * collapsible via the Header's toggle — unchanged behavior.
 *
 * Phone (<768px): becomes an off-canvas drawer instead of eating
 * screen space permanently. Hidden by default, slides in from the
 * left over a dark backdrop when the Header's hamburger opens it
 * (isMobileMenuOpen), and closes on backdrop tap, the X button, or
 * tapping any nav link.
 */
export function Sidebar() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);
  const isCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate({ to: '/login' });
  };

  const displayName = user
    ? user.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    : 'Guest';

  const initials = user
    ? `${(user?.firstName || user?.name || '?').charAt(0)}${(user?.lastName || '').charAt(0)}`.toUpperCase()
    : '?';

  const roleLabel =
    user?.role?.toLowerCase().replace(/[^a-z0-9]/g, '') === 'superadmin' ? 'Super Admin' : (user?.role || 'Plant Manager');

  return (
    <>
      {/* Backdrop — phone only, dismisses the drawer on tap */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'flex flex-col h-screen bg-background border-r border-border shrink-0 transition-transform duration-200',
          // Phone: fixed off-canvas drawer, slides in/out
          'fixed inset-y-0 left-0 z-50 w-[280px] -translate-x-full',
          isMobileMenuOpen && 'translate-x-0',
          // Tablet/desktop: back to normal in-flow, collapsible width
          'md:static md:z-auto md:translate-x-0 md:transition-[width] md:duration-200',
          isCollapsed ? 'md:w-[80px]' : 'md:w-[280px]'
        )}
      >
        <div className={cn('flex items-center justify-between gap-3 px-4 py-5', isCollapsed && 'md:justify-center md:px-0')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-input bg-primary flex items-center justify-center shrink-0">
              <Settings size={20} className="text-white" />
            </div>
            <div className={cn(isCollapsed && 'md:hidden')}>
              <p className="text-sm font-bold text-text-primary leading-tight">NorthForge</p>
              <p className="text-xs text-text-secondary leading-tight">Factory OS</p>
            </div>
          </div>
          {/* Close button — phone drawer only */}
          <button
            type="button"
            onClick={closeMobileMenu}
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tapping any nav link closes the phone drawer */}
        <div className="flex-1 overflow-y-auto px-3" onClick={closeMobileMenu}>
          {!isCollapsed && (
            <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary hidden md:block">
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
                // On the phone drawer always show full labels, even
                // if the desktop sidebar happens to be collapsed.
                collapsed={isCollapsed && !isMobileMenuOpen}
              />
            ))}
          </nav>
        </div>

        <div
          className={cn('px-4 py-4 border-t border-border', isCollapsed && 'md:flex md:justify-center md:px-0')}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu
            trigger={
              <button
                type="button"
                className={cn(
                  'flex items-center gap-3 rounded-input hover:bg-surface transition-colors w-full p-1 -m-1',
                  isCollapsed && 'md:justify-center md:w-auto md:p-1 md:m-0'
                )}
              >
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                  {initials}
                </div>
                <div className={cn('min-w-0 flex-1 text-left', isCollapsed && 'md:hidden')}>
                  <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
                  <p className="text-xs text-text-secondary truncate">{roleLabel}</p>
                </div>
              </button>
            }
            items={[
              { label: 'View Profile', icon: UserCircle, onClick: () => setIsProfileOpen(true) },
              { label: 'Logout', icon: LogOut, onClick: handleLogout, danger: true },
            ]}
          />
        </div>
      </aside>

      <Modal
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        title="My Profile"
        description="Your account details."
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg font-semibold shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-base font-semibold text-text-primary">{displayName}</p>
              <p className="text-sm text-text-secondary">{user?.email || '—'}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-border">
            <div>
              <dt className="text-xs text-text-secondary">Role</dt>
              <dd className="text-text-primary font-medium mt-0.5">{roleLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-secondary">Factory</dt>
              <dd className="text-text-primary font-medium mt-0.5">{user?.tenantName || '—'}</dd>
            </div>
          </dl>
        </div>
      </Modal>
    </>
  );
}