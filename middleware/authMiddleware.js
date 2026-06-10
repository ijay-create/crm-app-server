const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // =========================
    // 1. CHECK HEADER
    // =========================
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // =========================
    // 2. VERIFY TOKEN
    // =========================
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Token is invalid or expired",
      });
    }

    // =========================
    // 3. FIND USER
    // =========================
    const user = await User.findByPk(decoded.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // =========================
    // 4. ATTACH SAFE USER OBJECT
    // =========================
    req.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};

module.exports = protect;