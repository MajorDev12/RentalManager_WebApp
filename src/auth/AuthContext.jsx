import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "./authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const loadUserFromToken = () => {
    const token = authService.getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }

    const decoded = jwtDecode(token);

    setUser({
      id: decoded.sub,
      email: decoded.email,
      accountId: decoded.accountId,
      roles: decoded.role ? [decoded.role] : [],
      permissions: decoded.permissions ?? [],
      exp: decoded.exp,
    });
  };

  useEffect(() => {
    loadUserFromToken();
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) loadUserFromToken();
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role) => user?.roles?.includes(role);
  const hasPermission = (perm) => user?.permissions?.includes(perm);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};
