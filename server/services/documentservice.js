const fs = require("fs");
const path = require("path");

const PractitionerDocument = require("../models/practitionerdocument");
const Practitioner = require("../models/practitioner");

const saveDocument = async ({
  practitionerId,
  documentType,
  documentName,
  file,
}) => {
  if (!file) {
    const error = new Error("Document file is required");
    error.statusCode = 400;
    throw error;
  }

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
    documentName:
      documentName?.trim() || file.originalname,
    filePath: file.path,
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    verificationStatus: "pending",
  });

  return document;
};

const getDocumentsByPractitioner = async (
  practitionerId
) => {
  return PractitionerDocument.find({
    practitionerId,
  }).sort({
    createdAt: -1,
  });
};

const getDocumentById = async (documentId) => {
  const document =
    await PractitionerDocument.findById(documentId);

  if (!document) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  return document;
};

const approveDocument = async (
  documentId,
  adminId
) => {
  const document = await getDocumentById(documentId);

  document.verificationStatus = "approved";
  document.rejectionReason = null;
  document.verifiedBy = adminId;
  document.verifiedAt = new Date();

  await document.save();

  return document;
};

const rejectDocument = async (
  documentId,
  adminId,
  rejectionReason
) => {
  const document = await getDocumentById(documentId);

  document.verificationStatus = "rejected";
  document.rejectionReason =
    rejectionReason || "Document was rejected";
  document.verifiedBy = adminId;
  document.verifiedAt = new Date();

  await document.save();

  return document;
};

const deleteDocumentFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  const absolutePath = path.resolve(filePath);

  if (fs.existsSync(absolutePath)) {
    await fs.promises.unlink(absolutePath);
  }
};

module.exports = {
  saveDocument,
  getDocumentsByPractitioner,
  getDocumentById,
  approveDocument,
  rejectDocument,
  deleteDocumentFile,
};