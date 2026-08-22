const express = require("express");

const {
  registerUser,
  login,
} = require("../modules/auth/authcontroller");

const router = express.Router();

/*
 * User Registration
 * POST /api/auth/register/user
 */
router.post("/register/user", registerUser);

/*
 * User / Practitioner / Admin Login
 * POST /api/auth/login
 */
router.post("/login", login);

module.exports = router;