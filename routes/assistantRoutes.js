const express = require("express");

const {
  getInsights,
} = require("../controllers/assistantController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getInsights);

module.exports = router;