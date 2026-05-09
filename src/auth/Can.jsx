import { useAuthContext } from "./AuthContext";
import { can, canAny } from "./rbac";

export default function Can({
  permission,
  permissions = [],
  requireAny = false,
  children,
}) {
  const { user } = useAuthContext();

  if (!user) return null;

  if (permission) {
    return can(user, permission) ? children : null;
  }

  if (permissions.length) {
    const ok = requireAny
      ? canAny(user, permissions)
      : permissions.every((p) => can(user, p));

    return ok ? children : null;
  }

  return null;
}
