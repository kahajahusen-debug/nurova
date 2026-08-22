const mongoose = require("mongoose");

const practitionerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    qualification: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["practitioner"],
      default: "practitioner",
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

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Practitioner = mongoose.model(
  "Practitioner",
  practitionerSchema
);

module.exports = Practitioner;