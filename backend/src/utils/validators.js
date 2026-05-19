/**
 * Validation utilities
 * Centralized validation logic for consistency
 */

export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Minimum 6 characters, at least one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

export const validatePasswordStrength = (password) => {
  let strength = 0;
  let feedback = [];

  if (password.length >= 8) strength++;
  else feedback.push('At least 8 characters');

  if (/[a-z]/.test(password)) strength++;
  else feedback.push('At least one lowercase letter');

  if (/[A-Z]/.test(password)) strength++;
  else feedback.push('At least one uppercase letter');

  if (/\d/.test(password)) strength++;
  else feedback.push('At least one number');

  if (/[@$!%*?&]/.test(password)) strength++;
  else feedback.push('At least one special character');

  const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return {
    score: strength,
    strength: strengthLevels[strength],
    feedback,
  };
};

export const validateName = (name) => {
  return name.length >= 3 && name.length <= 50;
};

export const validateTaskTitle = (title) => {
  return title.length >= 3 && title.length <= 100;
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordStrength,
  validateName,
  validateTaskTitle,
};
