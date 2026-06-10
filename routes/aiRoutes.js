const express = require("express");

const {
  getAIInsights,
  chatWithAI,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   AI INSIGHTS (existing)
========================= */
router.get("/insights", protect, getAIInsights);

/* =========================
   AI CHAT (NEW 🔥)
========================= */
router.post("/chat", protect, chatWithAI);

module.exports = router;