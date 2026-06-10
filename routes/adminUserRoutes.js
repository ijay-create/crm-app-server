const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const rbac = require("../middleware/rbac");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const ActivityLog = require("../models/ActivityLog");

/* =========================
   GET ALL USERS (ADMIN)
========================= */
router.get("/", protect, rbac("READ"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* =========================
   CHANGE USER ROLE
========================= */
router.patch("/:id/role", protect, rbac("UPDATE"), async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ role });

    await ActivityLog.create({
      action: "ROLE_CHANGE",
      entity: "User",
      entityId: user.id,
      user: req.user.email,
      severity: "high",
    });

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Role update failed" });
  }
});

/* =========================
   ENABLE / DISABLE USER
========================= */
router.patch("/:id/status", protect, rbac("UPDATE"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newStatus = !user.isActive;

    await user.update({ isActive: newStatus });

    await ActivityLog.create({
      action: newStatus ? "USER_ENABLED" : "USER_DISABLED",
      entity: "User",
      entityId: user.id,
      user: req.user.email,
      severity: "medium",
    });

    res.json({
      message: newStatus ? "User enabled" : "User disabled",
      isActive: newStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.patch("/:id/password", protect, rbac("UPDATE"), async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);

    await user.update({ password: hashed });

    await ActivityLog.create({
      action: "PASSWORD_RESET",
      entity: "User",
      entityId: user.id,
      user: req.user.email,
      severity: "high",
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password update failed" });
  }
});

module.exports = router;