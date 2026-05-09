import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { canAny } from "./rbac";

export default function PermissionRoute({ permissions = [], children }) {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/login" replace />;

  if (permissions.length === 0) return children;

  const ok = canAny(user, permissions);

  if (!ok) return <Navigate to="/403" replace />;

  return children;
}
