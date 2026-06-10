const express = require("express");

const {
  createCheckoutSession,
} = require("../controllers/billingController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/checkout", protect, createCheckoutSession);

module.exports = router;