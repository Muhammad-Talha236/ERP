import { Menu, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NotificationBell } from './NotificationBell';
import { useUIStore } from '@/store/uiStore';

/**
 * Header — top bar shown above every page's content.
 *
 * The menu button is smart: on phone (<768px) it opens the sidebar
 * drawer, on tablet/desktop it collapses/expands the in-flow
 * sidebar — same button, different behavior based on screen size.
 *
 * On phone the search bar drops to its own full-width row below the
 * main header row instead of squeezing into it.
 */
export function Header({ title, subtitle }) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);

  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleMobileMenu();
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4">
        <Button variant="ghost" size="icon" onClick={handleMenuClick} aria-label="Toggle menu" className="shrink-0">
          <Menu size={18} className="md:hidden" />
          <PanelLeft size={18} className="hidden md:block" />
        </Button>

        <div className="min-w-0 flex-1 md:flex-initial md:min-w-[180px]">
          <h1 className="text-lg md:text-xl font-bold text-text-primary leading-tight truncate">{title}</h1>
          <p className="hidden sm:block text-sm text-text-secondary leading-tight truncate">{subtitle}</p>
        </div>

        {/* Search bar inline — tablet/desktop only */}
        <SearchBar className="hidden md:flex mx-auto" />

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>

      {/* Search bar as its own full-width row — phone only */}
      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}