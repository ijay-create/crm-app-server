const express = require("express");

const {
  createRule,
  getRules,
  triggerWebhook,
} = require("../controllers/automationController");

const protect = require("../middleware/authMiddleware");
const subscriptionGuard = require("../middleware/subscriptionGuard");

const router = express.Router();

/* =========================
   AUTOMATION RULES
========================= */

// Create automation rule (Pro plan required)
router.post(
  "/",
  protect,
  subscriptionGuard("pro"),
  createRule
);

// Get automation rules
router.get(
  "/",
  protect,
  getRules
);

/* =========================
   WEBHOOKS
========================= */

// External webhook endpoint
router.post(
  "/webhook",
  triggerWebhook
);

module.exports = router;