const bcrypt = require("bcryptjs");

const Admin = require("../../models/admin");
const Practitioner = require("../../models/practitioner");
const PractitionerDocument = require("../../models/practitionerdocument");

/*
 * Find admin by email
 */
const findAdminByEmail = async (email) => {
  return Admin.findOne({
    email: email.toLowerCase().trim(),
  });
};

/*
 * Compare admin password
 */
const compareAdminPassword = async (
  password,
  hashedPassword
) => {
  return bcrypt.compare(password, hashedPassword);
};

/*
 * Get all pending practitioners
 */
const getPendingPractitioners = async () => {
  return Practitioner.find({
    verificationStatus: "pending",
  })
    .select("-password")
    .sort({
      createdAt: -1,
    });
};

/*
 * Get one practitioner with all documents
 */
const getPractitionerForVerification = async (
  practitionerId
) => {
  const practitioner = await Practitioner.findById(
    practitionerId
  ).select("-password");

  if (!practitioner) {
    const error = new Error("Practitioner not found");
    error.statusCode = 404;
    throw error;
  }

  const documents = await PractitionerDocument.find({
    practitionerId,
  }).sort({
    createdAt: -1,
  });

  return {
    practitioner,
    documents,
  };
};

/*
 * Approve one practitioner document
 */
const approveDocument = async (
  documentId,
  adminId
) => {
  const document =
    await PractitionerDocument.findById(documentId);

  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  document.verificationStatus = "approved";
  document.rejectionReason = null;
  document.verifiedBy = adminId;
  document.verifiedAt = new Date();

  await document.save();

  return document;
};

/*
 * Reject one practitioner document
 */
const rejectDocument = async (
  documentId,
  adminId,
  rejectionReason
) => {
  const document =
    await PractitionerDocument.findById(documentId);

  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  document.verificationStatus = "rejected";
  document.rejectionReason =
    rejectionReason || "Document was rejected";
  document.verifiedBy = adminId;
  document.verifiedAt = new Date();

  await document.save();

  return document;
};

/*
 * Approve practitioner
 */
const approvePractitioner = async (
  practitionerId,
  adminId
) => {
  const practitioner = await Practitioner.findById(
    practitionerId
  );

  if (!practitioner) {
    const error = new Error("Practitioner not found");
    error.statusCode = 404;
    throw error;
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  practitioner.verificationStatus = "approved";
  practitioner.rejectionReason = null;
  practitioner.isActive = true;

  await practitioner.save();

  await PractitionerDocument.updateMany(
    {
      practitionerId,
      verificationStatus: "pending",
    },
    {
      $set: {
        verificationStatus: "approved",
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: null,
      },
    }
  );

  return practitioner;
};

/*
 * Reject practitioner
 */
const rejectPractitioner = async (
  practitionerId,
  adminId,
  rejectionReason
) => {
  const practitioner = await Practitioner.findById(
    practitionerId
  );

  if (!practitioner) {
    const error = new Error("Practitioner not found");
    error.statusCode = 404;
    throw error;
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  practitioner.verificationStatus = "rejected";
  practitioner.rejectionReason =
    rejectionReason || "Practitioner verification rejected";
  practitioner.isActive = false;

  await practitioner.save();

  await PractitionerDocument.updateMany(
    {
      practitionerId,
      verificationStatus: "pending",
    },
    {
      $set: {
        verificationStatus: "rejected",
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason:
          rejectionReason ||
          "Practitioner verification rejected",
      },
    }
  );

  return practitioner;
};

module.exports = {
  findAdminByEmail,
  compareAdminPassword,
  getPendingPractitioners,
  getPractitionerForVerification,
  approveDocument,
  rejectDocument,
  approvePractitioner,
  rejectPractitioner,
};