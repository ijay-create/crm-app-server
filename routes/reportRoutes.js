const express = require("express");

const {
  generateCustomerReport,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/customers", protect, generateCustomerReport);

module.exports = router;