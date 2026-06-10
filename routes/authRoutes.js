const express = require("express");
const {
  register,
  login,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", protect, (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

module.exports = router;