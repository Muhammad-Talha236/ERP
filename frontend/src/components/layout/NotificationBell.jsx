import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Bell, AlertTriangle, Clock, Info, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';

const SEVERITY_CONFIG = {
  danger: { icon: AlertTriangle, color: 'text-danger bg-danger/15' },
  warning: { icon: Clock, color: 'text-warning bg-warning/15' },
  info: { icon: Info, color: 'text-info bg-info/15' },
};

/**
 * NotificationBell — replaces the old static bell button in Header.
 * Shows a live count badge and, on click, a dropdown of notifications
 * derived from real module data (see useNotifications). Clicking a
 * notification navigates to the relevant page and closes the dropdown.
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, isLoading, count } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (to) => {
    navigate({ to });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="relative"
        onClick={() => setIsOpen((v) => !v)}
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-input border border-border bg-background shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-text-primary">Notifications</p>
            <p className="text-xs text-text-secondary">
              {count > 0 ? `${count} item${count === 1 ? '' : 's'} need attention` : 'You\'re all caught up'}
            </p>
          </div>

          {isLoading ? (
            <p className="px-4 py-6 text-sm text-text-secondary text-center">Loading...</p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <BellOff size={24} className="text-text-secondary mb-2" />
              <p className="text-sm text-text-secondary">No notifications right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((item) => {
                const config = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.info;
                const Icon = config.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.to)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface transition-colors"
                  >
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0', config.color)}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}