import { useMutation } from '@tanstack/react-query';
import { login } from '@/mocks/handlers/auth.mock';
import { useAuthStore } from '@/store/authStore';

/**
 * useLogin — mutation hook for the Login form. On success, stores
 * the session in authStore, which every route guard/component reads
 * from afterward.
 */
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => setSession(data),
  });
}