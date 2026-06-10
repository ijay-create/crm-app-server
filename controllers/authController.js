const bcrypt = require("bcryptjs");
const User = require("../models/User");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// =======================
// REGISTER
// =======================
const register = async (req, res) => {
  try {
    const { fullName, email, password, companyId, role } = req.body;

    const exists = await User.findOne({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      companyId: companyId || 1,
      role: role || "staff",
      isActive: true,
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        isActive: user.isActive,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Register error",
    });
  }
};

// =======================
// LOGIN
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        isActive: user.isActive,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login error",
    });
  }
};

// =======================
// LOGOUT
// =======================
const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");

    return res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Logout error",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};