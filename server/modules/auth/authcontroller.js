const {
  validateRegistration,
  validateLogin,
} = require("./authvalidation");

const {
  findAccountByEmail,
  checkEmailExists,
  comparePassword,
  createUser,
} = require("./authservice");

const generateToken = require("../../utils/generatetokens");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const validation = validateRegistration({
      name,
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

    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const user = await createUser({
      name,
      email,
      password,
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin({
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

    const accountData = await findAccountByEmail(email);

    if (!accountData) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { account, role } = accountData;

    const passwordMatch = await comparePassword(
      password,
      account.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /*
     * Practitioner verification check
     */
    if (role === "practitioner") {
      if (account.verificationStatus === "pending") {
        return res.status(403).json({
          success: false,
          message:
            "Your practitioner account is waiting for admin verification",
          verificationStatus: "pending",
        });
      }

      if (account.verificationStatus === "rejected") {
        return res.status(403).json({
          success: false,
          message: "Your practitioner account was rejected",
          verificationStatus: "rejected",
          rejectionReason: account.rejectionReason || null,
        });
      }

      if (!account.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your practitioner account is inactive",
        });
      }
    }

    /*
     * Admin/User account check
     */
    if (account.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    const token = generateToken(account._id, role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role,
        ...(role === "practitioner" && {
          verificationStatus: account.verificationStatus,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  login,
};