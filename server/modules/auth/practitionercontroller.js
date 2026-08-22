const {
  validatePractitionerRegistration,
  validateDocument,
} = require("./practitionervalidation");

const {
  createPractitioner,
  getPractitionerById,
  getPractitionerDocuments,
  addPractitionerDocument,
} = require("./practitionerservice");

/*
 * Practitioner Registration
 */
const registerPractitioner = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      qualification,
      bio,
    } = req.body;

    const validation = validatePractitionerRegistration({
      name,
      email,
      password,
      specialization,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const practitioner = await createPractitioner({
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      qualification,
      bio,
    });

    return res.status(201).json({
      success: true,
      message:
        "Practitioner registered successfully. Please upload your documents for verification.",
      practitioner: {
        id: practitioner._id,
        name: practitioner.name,
        email: practitioner.email,
        role: practitioner.role,
        verificationStatus:
          practitioner.verificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Get Practitioner Profile
 */
const getPractitionerProfile = async (req, res, next) => {
  try {
    const practitionerId = req.user.id;

    const practitioner =
      await getPractitionerById(practitionerId);

    return res.status(200).json({
      success: true,
      practitioner,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Upload Practitioner Document
 */
const uploadPractitionerDocument = async (
  req,
  res,
  next
) => {
  try {
    const practitionerId = req.user.id;

    const {
      documentType,
      documentName,
    } = req.body;

    const validation = validateDocument({
      documentType,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Document validation failed",
        errors: validation.errors,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    const document = await addPractitionerDocument({
      practitionerId,
      documentType,
      documentName:
        documentName || req.file.originalname,
      filePath: req.file.path,
      originalFileName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message:
        "Document uploaded successfully and is pending verification",
      document: {
        id: document._id,
        documentType: document.documentType,
        documentName: document.documentName,
        originalFileName:
          document.originalFileName,
        verificationStatus:
          document.verificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Get Practitioner Documents
 */
const getMyDocuments = async (req, res, next) => {
  try {
    const practitionerId = req.user.id;

    const documents =
      await getPractitionerDocuments(
        practitionerId
      );

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerPractitioner,
  getPractitionerProfile,
  uploadPractitionerDocument,
  getMyDocuments,
};