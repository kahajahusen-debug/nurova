const validateAdminLogin = ({ email, password }) => {
  const errors = {};

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
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validatePractitionerVerification = ({
  practitionerId,
  status,
  rejectionReason,
}) => {
  const errors = {};

  if (!practitionerId) {
    errors.practitionerId =
      "Practitioner ID is required";
  }

  if (!status) {
    errors.status = "Verification status is required";
  } else if (!["approved", "rejected"].includes(status)) {
    errors.status =
      "Status must be approved or rejected";
  }

  if (
    status === "rejected" &&
    (!rejectionReason ||
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim())
  ) {
    errors.rejectionReason =
      "Rejection reason is required when rejecting a practitioner";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateDocumentVerification = ({
  documentId,
  status,
  rejectionReason,
}) => {
  const errors = {};

  if (!documentId) {
    errors.documentId = "Document ID is required";
  }

  if (!status) {
    errors.status = "Verification status is required";
  } else if (!["approved", "rejected"].includes(status)) {
    errors.status =
      "Status must be approved or rejected";
  }

  if (
    status === "rejected" &&
    (!rejectionReason ||
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim())
  ) {
    errors.rejectionReason =
      "Rejection reason is required when rejecting a document";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateAdminLogin,
  validatePractitionerVerification,
  validateDocumentVerification,
};