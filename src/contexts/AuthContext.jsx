/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { login as loginApi } from "../api/auth";
import { AUTH_STORAGE_KEY, USE_MOCK_API } from "../api/config";

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const role = auth?.role || null; // "worker" | "admin"

  const persistAuth = (nextAuth) => {
    setAuth(nextAuth);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const login = async (payload) => {
    if (USE_MOCK_API) {
      const selectedRole = typeof payload === "string" ? payload : payload?.role || "worker";
      const nextAuth = {
        accessToken: "mock-access-token",
        user: {
          userId: selectedRole === "admin" ? 1 : 2,
          userName: selectedRole === "admin" ? "Admin" : "Worker",
          role: selectedRole.toUpperCase(),
        },
        role: selectedRole,
      };
      persistAuth(nextAuth);
      return nextAuth;
    }

    const response = await loginApi(payload);
    const nextAuth = {
      accessToken: response.accessToken,
      user: response,
      role: response.role?.toLowerCase(),
    };
    persistAuth(nextAuth);
    return nextAuth;
  };

  const logout = () => {
    setAuth(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        accessToken: auth?.accessToken || null,
        user: auth?.user || null,
        isAuthenticated: Boolean(auth?.accessToken),
        isMockApi: USE_MOCK_API,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
