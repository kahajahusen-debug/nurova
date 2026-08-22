const validatePractitionerRegistration = ({
  name,
  email,
  password,
  specialization,
}) => {
  const errors = {};

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.name = "Name is required";
  }

  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      errors.email = "A valid email is required";
    }
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (
    !specialization ||
    typeof specialization !== "string" ||
    !specialization.trim()
  ) {
    errors.specialization = "Specialization is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateDocument = ({ documentType }) => {
  const errors = {};

  if (
    !documentType ||
    typeof documentType !== "string" ||
    !documentType.trim()
  ) {
    errors.documentType = "Document type is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validatePractitionerRegistration,
  validateDocument,
};