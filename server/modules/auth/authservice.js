const bcrypt = require("bcryptjs");

const User = require("../../models/user");
const Practitioner = require("../../models/practitioner");
const Admin = require("../../models/admin");

const findAccountByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (user) {
    return {
      account: user,
      role: "user",
    };
  }

  const practitioner = await Practitioner.findOne({
    email: normalizedEmail,
  });

  if (practitioner) {
    return {
      account: practitioner,
      role: "practitioner",
    };
  }

  const admin = await Admin.findOne({
    email: normalizedEmail,
  });

  if (admin) {
    return {
      account: admin,
      role: "admin",
    };
  }

  return null;
};

const checkEmailExists = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.exists({
    email: normalizedEmail,
  });

  if (user) {
    return true;
  }

  const practitioner = await Practitioner.exists({
    email: normalizedEmail,
  });

  if (practitioner) {
    return true;
  }

  const admin = await Admin.exists({
    email: normalizedEmail,
  });

  return Boolean(admin);
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const createUser = async ({ name, email, password }) => {
  const hashedPassword = await hashPassword(password);

  return User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: "user",
    isActive: true,
  });
};

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
  const hashedPassword = await hashPassword(password);

  return Practitioner.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    phone,
    specialization,
    experience: experience || 0,
    qualification,
    bio,
    role: "practitioner",
    verificationStatus: "pending",
    isActive: false,
  });
};

module.exports = {
  findAccountByEmail,
  checkEmailExists,
  hashPassword,
  comparePassword,
  createUser,
  createPractitioner,
};