import axios from 'axios';

/**
 * apiClient — the single Axios instance for all real backend calls.
 *
 * NOT currently used by any hook (we're on mocks/ for now), but
 * fully configured so that switching a hook from mock data to real
 * API calls later requires zero setup here — just import and use.
 *
 * baseURL comes from an environment variable so dev/staging/production
 * can point at different servers without code changes (see .env.example,
 * to be added when we're ready to actually connect a backend).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor — automatically attaches the JWT access token
 * (per docs/API/05_API_Documentation_Part1.md: "Authorization: Bearer
 * <access_token>") to every outgoing request, once auth/login exists.
 *
 * Currently reads from localStorage directly since there's no auth
 * store yet — that's outside this module's scope (a teammate or
 * later phase will build real login). This interceptor just needs
 * to exist and be correct; it does nothing harmful if the token
 * isn't there yet (header is simply omitted).
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor — unwraps the API's consistent response
 * envelope ({ success, message, data }) documented across every
 * API doc, so calling code can work directly with `data` instead
 * of repeating `.data.data` everywhere.
 *
 * Also centralizes basic error handling — e.g. redirecting to login
 * on a 401 — in ONE place instead of every API call site.
 */
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired/invalid — real auth flow will handle this
      // properly later (refresh token, redirect to login, etc.)
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(error.response?.data || error);
  }
);