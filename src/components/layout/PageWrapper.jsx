import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../auth/AuthContext";

export default function AccessControl({
  permissions = [],
  requireAll = false,
  fallback = null,
  redirectTo = "/403",
  children,
}) {
  const { user, hasPermission, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowed =
    permissions.length === 0
      ? true
      : requireAll
        ? permissions.every((p) => hasPermission(p))
        : permissions.some((p) => hasPermission(p));

  if (!allowed) {
    return fallback || <Navigate to={redirectTo} replace />;
  }

  return children;
}
