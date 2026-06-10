const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const rbac = require("../middleware/rbac");

const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* =========================
   GET ALL USERS
========================= */
router.get("/", protect, rbac("READ"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

/* =========================
   CREATE USER
========================= */
router.post("/", protect, rbac("CREATE"), async (req, res) => {
  try {
    const { fullName, email, password, role, companyId } = req.body;

    const exists = await User.findOne({ where: { email } });

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
      role,
      companyId: companyId || req.user.companyId,
      isActive: true,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

/* =========================
   UPDATE USER
========================= */
router.put("/:id", protect, rbac("UPDATE"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.update(req.body);

    res.json({
      message: "User updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Update failed",
    });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.patch("/:id/reset-password", protect, rbac("UPDATE"), async (req, res) => {
  try {
    const { newPassword } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashed,
    });

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Password reset failed",
    });
  }
});

/* =========================
   ENABLE / DISABLE USER
========================= */
router.patch("/:id/status", protect, rbac("UPDATE"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newStatus = !user.isActive;

    await user.update({
      isActive: newStatus,
    });

    res.json({
      message: newStatus ? "User enabled" : "User disabled",
      isActive: newStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Status update failed",
    });
  }
});

module.exports = router;