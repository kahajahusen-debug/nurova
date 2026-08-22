const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("Password is required");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (
  password,
  hashedPassword
) => {
  if (!password || !hashedPassword) {
    return false;
  }

  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};