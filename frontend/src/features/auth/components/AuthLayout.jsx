import { Settings } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AuthLayout — shared shell for Login/Signup pages.
 *
 * Deliberately does NOT use AppLayout (no sidebar/header) — these
 * are standalone, pre-authentication screens, matching how your
 * original screenshots showed Login/Signup as full-screen pages.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {React.ReactNode} props.children
 */
export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo/brand header, matching the sidebar's own branding */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-input bg-primary flex items-center justify-center">
            <Settings size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary leading-tight">NorthForge</p>
            <p className="text-xs text-text-secondary leading-tight">Factory OS</p>
          </div>
        </div>

        <div className="rounded-card border border-border bg-background p-8 shadow-lg">
          <h1 className="text-xl font-bold text-text-primary text-center">{title}</h1>
          <p className="text-sm text-text-secondary text-center mt-1 mb-6">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};