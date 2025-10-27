export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const sanitizedEmail = email.trim().toLowerCase();
  // allow multi-part & country TLDs (.it, .com.br, etc.)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return regex.test(sanitizedEmail);
};
