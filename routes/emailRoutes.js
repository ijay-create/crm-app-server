const express = require("express");

const {
  sendCampaign,
} = require("../controllers/emailController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/campaign", protect, sendCampaign);

module.exports = router;