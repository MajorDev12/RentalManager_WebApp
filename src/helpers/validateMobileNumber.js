export const validateMobileNumber = (value, required = false) => {
  if (!value && required) return false;

  // Normalize: remove leading + or spaces
  const cleaned = value.trim().replace(/^(\+)?/, '');

  const mobileRegex = /^(?:0?(7|1)\d{8})$/;

  return mobileRegex.test(cleaned);
};

