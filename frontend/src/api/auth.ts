import api, { TOKEN_KEY } from "./client";
import type { Token, LoginCredentials, RegisterPayload, User } from "../types";

export async function login(credentials: LoginCredentials): Promise<Token> {
  // OAuth2 password flow requires form-encoded data, not JSON
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const { data } = await api.post<Token>("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  localStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
