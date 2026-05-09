export const can = (user, permission) => {
  if (!user?.permissions) return false;
  return user.permissions.includes(permission);
};

export const canAny = (user, permissions = []) => {
  if (!user?.permissions) return false;
  return permissions.some((p) => user.permissions.includes(p));
};

export const canAll = (user, permissions = []) => {
  if (!user?.permissions) return false;
  return permissions.every((p) => user.permissions.includes(p));
};

export const hasRole = (user, roles = []) => {
  if (!user) return false;
  return roles.some((r) => user.roles?.includes(r));
};
