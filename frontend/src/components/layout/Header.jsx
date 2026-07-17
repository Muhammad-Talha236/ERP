import { PanelLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useUIStore } from '@/store/uiStore';

/**
 * Header — top bar shown above every page's content.
 *
 * @param {Object} props
 * @param {string} props.title - page title (e.g. "Employees")
 * @param {string} props.subtitle - page description (e.g. "Manage your workforce")
 *
 * title/subtitle are passed by each individual page component, so
 * the same Header renders differently per route without any
 * route-based conditional logic living inside Header itself.
 */
export function Header({ title, subtitle }) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="flex items-center gap-4 px-6 py-4 border-b border-border bg-background">
      {/* Sidebar collapse toggle */}
      <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <PanelLeft size={18} />
      </Button>

      {/* Page title + subtitle */}
      <div className="min-w-[180px]">
        <h1 className="text-xl font-bold text-text-primary leading-tight">{title}</h1>
        <p className="text-sm text-text-secondary leading-tight">{subtitle}</p>
      </div>

      {/* Search bar takes remaining space */}
      <SearchBar className="mx-auto" />

      {/* Right-side actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell size={18} />
          {/* Notification indicator dot — static for now, will reflect
              real unread count once notification API exists */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
        </Button>
      </div>
    </header>
  );
}