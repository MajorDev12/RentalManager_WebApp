export const validateEmail = (email) => {
  const value = (email || "").trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailRegex.test(value)) {
    return false;
  }

  return true;
};
