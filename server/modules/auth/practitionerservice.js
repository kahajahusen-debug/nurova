const Practitioner = require("../../models/practitioner");
const PractitionerDocument = require("../../models/practitionerdocument");
const Admin = require("../../models/admin");

const {
  checkEmailExists,
  hashPassword,
} = require("./authservice");

/*
 * Create a new practitioner
 */
const createPractitioner = async ({
  name,
  email,
  password,
  phone,
  specialization,
  experience,
  qualification,
  bio,
}) => {
  const emailExists = await checkEmailExists(email);

  if (emailExists) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const practitioner = await Practitioner.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    phone: phone ? phone.trim() : undefined,
    specialization: specialization.trim(),
    experience: experience || 0,
    qualification: qualification
      ? qualification.trim()
      : undefined,
    bio: bio ? bio.trim() : undefined,
    role: "practitioner",
    verificationStatus: "pending",
    isActive: false,
  });

  return practitioner;
};

/*
 * Find practitioner by ID
 */
const getPractitionerById = async (practitionerId) => {
  const practitioner = await Practitioner.findById(
    practitionerId
  ).select("-password");

  if (!practitioner) {
    const error = new Error("Practitioner not found");
    error.statusCode = 404;
    throw error;
  }

  return practitioner;
};

/*
 * Get practitioner documents
 */
const getPractitionerDocuments = async (practitionerId) => {
  return PractitionerDocument.find({
    practitionerId,
  }).sort({
    createdAt: -1,
  });
};

/*
 * Add practitioner document
 */
const addPractitionerDocument = async ({
  practitionerId,
  documentType,
  documentName,
  filePath,
  originalFileName,
  mimeType,
}) => {
  const practitioner = await Practitioner.findById(
    practitionerId
  );

  if (!practitioner) {
    const error = new Error("Practitioner not found");
    error.statusCode = 404;
    throw error;
  }

  const document = await PractitionerDocument.create({
    practitionerId,
    documentType: documentType.trim(),
    documentName: documentName.trim(),
    filePath,
    originalFileName,
    mimeType,
    verificationStatus: "pending",
  });

  return document;
};

/*
 * Get all pending practitioners for admin
 */
const getPendingPractitioners = async () => {
  return Practitioner.find({
    verificationStatus: "pending",
  }).select("-password");
};

/*
 * Get practitioner with documents
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
  });

  return {
    practitioner,
    documents,
  };
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
    rejectionReason || "Documents were rejected";
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
          rejectionReason || "Document was rejected",
      },
    }
  );

  return practitioner;
};

module.exports = {
  createPractitioner,
  getPractitionerById,
  getPractitionerDocuments,
  addPractitionerDocument,
  getPendingPractitioners,
  getPractitionerForVerification,
  approvePractitioner,
  rejectPractitioner,
};