import { useMutation } from '@tanstack/react-query';
import { signup } from '@/mocks/handlers/auth.mock';
import { useAuthStore } from '@/store/authStore';

/**
 * useSignup — mutation hook for the Signup form. Same session
 * side-effect as useLogin, since a successful signup logs the user
 * in immediately (standard SaaS UX — no separate "please log in
 * after signing up" step).
 */
export function useSignup() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => setSession(data),
  });
}