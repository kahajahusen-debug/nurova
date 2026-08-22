const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  if (!userId) {
    throw new Error("User ID is required to generate token");
  }

  if (!role) {
    throw new Error("User role is required to generate token");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: userId.toString(),
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;