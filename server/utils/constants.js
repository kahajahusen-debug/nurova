const ROLES = Object.freeze({
  USER: "user",
  PRACTITIONER: "practitioner",
  ADMIN: "admin",
});

const VERIFICATION_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

const DOCUMENT_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

const ALLOWED_DOCUMENT_TYPES = Object.freeze([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

module.exports = {
  ROLES,
  VERIFICATION_STATUS,
  DOCUMENT_STATUS,
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE,
};