import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { useThemeStore } from '@/store/themeStore';
import App from './App.jsx';
import './index.css';

/**
 * Apply the persisted theme to <html> BEFORE the first paint.
 *
 * We read directly from the Zustand store's state here (outside of
 * React, using getState()) rather than inside a component, because
 * this needs to run once, synchronously, at boot — not as part of
 * React's render cycle. This prevents a "flash" where the app
 * briefly renders in the default theme before switching to the
 * user's saved preference.
 */
const savedTheme = useThemeStore.getState().theme;
document.documentElement.classList.toggle('dark', savedTheme === 'dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      QueryClientProvider makes the queryClient instance available
      to every component in the tree via React Query's hooks
      (useQuery, useMutation, etc.) — this is what will eventually
      power useEmployees(), useAttendance(), useMaterials(), etc.
    */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);