import { Sun, Moon } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';

/**
 * ThemeToggle — icon button in the Header that switches between
 * light and dark mode.
 *
 * Shows a Sun icon when currently in dark mode (implying "tap to
 * go light") and a Moon icon when in light mode — this is the
 * standard convention (icon represents the mode you'll SWITCH TO).
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}