export const validateTextInput = (value, required = true) => {
  const trimmedValue = (value || "").trim();

  if (required && trimmedValue.length === 0) {
    return false;
  }

  return true; // no error
};
