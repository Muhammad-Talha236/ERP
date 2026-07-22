import { useState } from 'react';
import { Building2, CheckCircle2, XCircle, LogOut, Settings } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { StatCard } from '@/components/ui/StatCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { TenantsTable } from './components/TenantsTable';
import { CreateTenantModal } from './components/CreateTenantModal';
import { EditTenantModal } from './components/EditTenantModal';
import { useTenants } from './hooks/useTenants';
import { useCurrentUser, useAuthStore } from '@/store/authStore';

/**
 * SuperAdminPage — platform-level console for managing factory
 * accounts. Redesigned to match the visual language of the rest of
 * the app (same header/branding/card style as AppLayout + Header),
 * while still deliberately not using the full factory Sidebar
 * (Employees/Production/etc. don't apply at the platform level).
 */
export function SuperAdminPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTenant, setEditTenant] = useState(null);

  const { data: tenants, isLoading } = useTenants();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const total = tenants?.length ?? 0;
  const active = tenants?.filter((t) => t.status === 'Active').length ?? 0;
  const suspended = tenants?.filter((t) => t.status === 'Suspended').length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* --- Header, matching the same branding style as the factory Sidebar --- */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-input bg-primary flex items-center justify-center">
            <Settings size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-tight">NorthForge</p>
            <p className="text-xs text-text-secondary leading-tight">Platform Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : '?'}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-text-primary leading-tight">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-text-secondary leading-tight">Super Admin</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Factories</h1>
          <p className="text-sm text-text-secondary">Manage all factory accounts on the platform</p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-wrap gap-4">
            <StatCard label="Total Factories" value={total} icon={Building2} accent="primary" />
            <StatCard label="Active" value={active} icon={CheckCircle2} accent="success" />
            <StatCard label="Suspended" value={suspended} icon={XCircle} accent="danger" />
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>+ New Factory</Button>
        </div>

        <TenantsTable tenants={tenants} isLoading={isLoading} onEditClick={setEditTenant} />
      </main>

      <CreateTenantModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditTenantModal open={Boolean(editTenant)} onOpenChange={(open) => !open && setEditTenant(null)} tenant={editTenant} />
    </div>
  );
}