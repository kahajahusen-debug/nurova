const {
  validateAdminLogin,
  validatePractitionerVerification,
  validateDocumentVerification,
} = require("./adminvalidation");

const {
  findAdminByEmail,
  compareAdminPassword,
  getPendingPractitioners,
  getPractitionerForVerification,
  approveDocument,
  rejectDocument,
  approvePractitioner,
  rejectPractitioner,
} = require("./adminservice");

const generateToken = require("../../utils/generatetokens");

/*
 * Admin Login
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validation = validateAdminLogin({
      email,
      password,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const admin = await findAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    const passwordMatch = await compareAdminPassword(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(
      admin._id,
      "admin"
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Get pending practitioners
 */
const getPendingPractitionersController = async (
  req,
  res,
  next
) => {
  try {
    const practitioners =
      await getPendingPractitioners();

    return res.status(200).json({
      success: true,
      count: practitioners.length,
      practitioners,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Get practitioner details and documents
 */
const getPractitionerForVerificationController =
  async (req, res, next) => {
    try {
      const { practitionerId } = req.params;

      const result =
        await getPractitionerForVerification(
          practitionerId
        );

      return res.status(200).json({
        success: true,
        practitioner: result.practitioner,
        documents: result.documents,
      });
    } catch (error) {
      next(error);
    }
  };

/*
 * Approve or reject a practitioner
 */
const verifyPractitioner = async (
  req,
  res,
  next
) => {
  try {
    const { practitionerId } = req.params;

    const {
      status,
      rejectionReason,
    } = req.body;

    const validation =
      validatePractitionerVerification({
        practitionerId,
        status,
        rejectionReason,
      });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    let practitioner;

    if (status === "approved") {
      practitioner = await approvePractitioner(
        practitionerId,
        req.user.id
      );
    } else {
      practitioner = await rejectPractitioner(
        practitionerId,
        req.user.id,
        rejectionReason
      );
    }

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Practitioner approved successfully"
          : "Practitioner rejected successfully",
      practitioner: {
        id: practitioner._id,
        name: practitioner.name,
        email: practitioner.email,
        verificationStatus:
          practitioner.verificationStatus,
        isActive: practitioner.isActive,
        rejectionReason:
          practitioner.rejectionReason,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
 * Approve or reject an individual document
 */
const verifyDocument = async (
  req,
  res,
  next
) => {
  try {
    const { documentId } = req.params;

    const {
      status,
      rejectionReason,
    } = req.body;

    const validation =
      validateDocumentVerification({
        documentId,
        status,
        rejectionReason,
      });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    let document;

    if (status === "approved") {
      document = await approveDocument(
        documentId,
        req.user.id
      );
    } else {
      document = await rejectDocument(
        documentId,
        req.user.id,
        rejectionReason
      );
    }

    return res.status(200).json({
      success: true,
      message:
        status === "approved"
          ? "Document approved successfully"
          : "Document rejected successfully",
      document,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminLogin,
  getPendingPractitionersController,
  getPractitionerForVerificationController,
  verifyPractitioner,
  verifyDocument,
};