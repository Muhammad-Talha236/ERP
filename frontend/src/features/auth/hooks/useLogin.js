import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

/**
 * useLogin — mutation hook for the Login form. On success, stores
 * the session in authStore, which every route guard/component reads
 * from afterward.
 */

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setSession({
        user: data.user,
        accessToken: data.token, // 👈 backend response ka field-name yahan match karo
      });
    },
  });
}