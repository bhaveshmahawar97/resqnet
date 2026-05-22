export const validateRegisterBody = ({ fullName, email, password }) => {
  const errors = [];
  if (!fullName?.trim()) errors.push("fullName is required");
  if (!email?.trim()) errors.push("email is required");
  if (!password || password.length < 6) errors.push("password must be at least 6 characters");
  return { valid: errors.length === 0, errors };
};

export const validateLoginBody = ({ email, password }) => {
  const errors = [];
  if (!email?.trim()) errors.push("email is required");
  if (!password) errors.push("password is required");
  return { valid: errors.length === 0, errors };
};
