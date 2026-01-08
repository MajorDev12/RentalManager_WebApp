import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../auth/AuthContext";

export default function PageWrapper({
  children,
  roles = [],
  permissions = [],
}) {
  const {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    hasPermission,
  } = useAuthContext();

  // ⏳ Wait until auth is resolved
  if (isLoading) return null; // or spinner

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🧑 Role enforcement
  if (roles.length > 0 && !roles.some(hasRole)) {
    return <Navigate to="/403" replace />;
  }

  // 🔑 Permission enforcement
  // if (permissions.length > 0 && !permissions.some(hasPermission)) {
  //   return <Navigate to="/403" replace />;
  // }

  return children;
}
