import { Settings } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarLink } from './SidebarLink';

/**
 * Sidebar — fixed left navigation panel.
 *
 * Structure (matches design screenshots):
 *  1. Logo + workspace name (top)
 *  2. "Workspace" section label + scrollable nav links
 *  3. User profile footer (bottom, sticky)
 *
 * This component currently only handles the EXPANDED state.
 * Collapse/expand behavior (280px <-> 80px per the UI doc) will be
 * added later via uiStore.js once we build that piece — for now,
 * the structure is what matters most.
 */
export function Sidebar() {
  return (
    <aside className="flex flex-col h-screen w-[280px] bg-background border-r border-border shrink-0">
      {/* --- Logo / workspace header --- */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="w-10 h-10 rounded-input bg-primary flex items-center justify-center shrink-0">
          <Settings size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary leading-tight">NorthForge</p>
          <p className="text-xs text-text-secondary leading-tight">Factory OS</p>
        </div>
      </div>

      {/* --- Navigation --- */}
      <div className="flex-1 overflow-y-auto px-3">
        <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Workspace
        </p>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>
      </div>

      {/* --- User profile footer --- */}
      {/* Placeholder data — will be sourced from an auth store once
          login/session management exists (outside current module scope) */}
      <div className="flex items-center gap-3 px-4 py-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
          PM
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">Priya Menon</p>
          <p className="text-xs text-text-secondary truncate">Plant Manager</p>
        </div>
      </div>
    </aside>
  );
}