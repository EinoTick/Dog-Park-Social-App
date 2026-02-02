/**
 * Auth context — provides the current user and login/logout functions
 * to the entire React component tree.
 *
 * Uses TanStack Query to fetch /users/me on mount (if a token exists).
 * If the token is missing or expired, the user is null.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../api/users";
import { getStoredToken, logout as apiLogout } from "../api/auth";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const hasToken = !!getStoredToken();

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: hasToken, // only fetch if we have a stored token
    retry: false,
  });

  const logout = () => {
    queryClient.clear();
    apiLogout();
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
