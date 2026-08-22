const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email.trim());
};

const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return false;
  }

  return password.length >= 6;
};

const validateRegistration = ({ name, email, password }) => {
  const errors = {};

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.name = "Name is required";
  }

  if (!validateEmail(email)) {
    errors.email = "A valid email is required";
  }

  if (!validatePassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!validateEmail(email)) {
    errors.email = "A valid email is required";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRegistration,
  validateLogin,
};