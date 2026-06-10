const express = require("express");

const {
  getRevenueStats,
} = require("../controllers/financeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/revenue", protect, getRevenueStats);

module.exports = router;