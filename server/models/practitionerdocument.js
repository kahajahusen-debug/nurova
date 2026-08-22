const mongoose = require("mongoose");

const practitionerDocumentSchema = new mongoose.Schema(
  {
    practitionerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Practitioner",
      required: true,
    },

    documentType: {
      type: String,
      required: true,
      trim: true,
    },

    documentName: {
      type: String,
      required: true,
      trim: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const PractitionerDocument = mongoose.model(
  "PractitionerDocument",
  practitionerDocumentSchema
);

module.exports = PractitionerDocument;