/**
 * Configured Axios instance that handles JWT auth automatically.
 *
 * HOW IT WORKS:
 * 1. On login, the JWT token is saved to localStorage.
 * 2. The request interceptor reads it and adds `Authorization: Bearer <token>`
 *    to every outgoing request.
 * 3. The response interceptor catches 401 errors — if the token has expired
 *    or is invalid, it clears localStorage and redirects to /login.
 *
 * All API modules (auth.ts, dogs.ts, etc.) import this `api` instance
 * instead of raw axios, so auth is handled once and everywhere.
 */

import axios from "axios";

const TOKEN_KEY = "access_token";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// --- Request interceptor: attach JWT ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: handle 401 ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default api;
