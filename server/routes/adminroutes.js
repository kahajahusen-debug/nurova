const express = require("express");

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const {
  adminLogin,
  getPendingPractitionersController,
  getPractitionerForVerificationController,
  verifyPractitioner,
  verifyDocument,
} = require("../modules/auth/admincontroller");

const router = express.Router();

/*
 * Admin Login
 * POST /api/admin/login
 *
 * Admin does not need a JWT before logging in.
 */
router.post(
  "/login",
  adminLogin
);

/*
 * Get all pending practitioners
 * GET /api/admin/practitioners/pending
 */
router.get(
  "/practitioners/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingPractitionersController
);

/*
 * Get practitioner details and documents
 * GET /api/admin/practitioners/:practitionerId
 */
router.get(
  "/practitioners/:practitionerId",
  authMiddleware,
  roleMiddleware("admin"),
  getPractitionerForVerificationController
);

/*
 * Approve / Reject practitioner
 * PATCH /api/admin/practitioners/:practitionerId/verify
 */
router.patch(
  "/practitioners/:practitionerId/verify",
  authMiddleware,
  roleMiddleware("admin"),
  verifyPractitioner
);

/*
 * Approve / Reject individual document
 * PATCH /api/admin/documents/:documentId/verify
 */
router.patch(
  "/documents/:documentId/verify",
  authMiddleware,
  roleMiddleware("admin"),
  verifyDocument
);

module.exports = router;