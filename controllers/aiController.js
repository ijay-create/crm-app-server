const Customer = require("../models/Customer");
const generateInsights = require("../utils/smartBrain");
const askFreeAI = require("../utils/freeAI");

/* =========================
   SALES COPILOT (STABLE VERSION)
========================= */
const getAIInsights = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({
        message: "Unauthorized: missing company context",
      });
    }

    const customers = await Customer.findAll({
      where: { companyId },
    });

    const smartData = generateInsights(customers);

    /* =========================
       SALES COPILOT PROMPT
    ========================= */
    const prompt = `
You are an elite AI Sales Copilot.

You help sales teams decide what to do FIRST today.

CRM Data:
- Total customers: ${smartData.summary.total}
- Active customers: ${smartData.summary.active}
- Leads: ${smartData.summary.leads}
- Inactive: ${smartData.summary.inactive}

Rules:
- Leads = conversion opportunities
- Active = current revenue
- Inactive = reactivation targets

TASK:
Give ONE extremely short action (max 20 words).
Be specific and actionable.
Focus ONLY on revenue impact.
`;

    let aiResponse = "Call top leads and follow up immediately.";

    try {
      const ai = await askFreeAI(prompt);

      if (typeof ai === "string" && ai.trim().length > 0) {
        aiResponse = ai.trim();
      }
    } catch (err) {
      console.error("AI Copilot Error:", err);
    }

    /* =========================
       CLEAN RESPONSE (NO LEAKS)
    ========================= */
    return res.json({
      summary: smartData.summary,

      copilot: {
        topPriority: smartData.copilot.topPriority,
        nextBestActions: smartData.copilot.nextBestActions,
      },

      aiSuggestion: aiResponse,
    });

  } catch (error) {
    console.error("AI Copilot system error:", error);
    res.status(500).json({ message: "AI system error" });
  }
};

/* =========================
   AI CHAT (SAFE VERSION)
========================= */
const chatWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    let reply = "AI service unavailable";

    try {
      const ai = await askFreeAI(prompt);

      if (typeof ai === "string" && ai.trim().length > 0) {
        reply = ai.trim();
      }
    } catch (err) {
      console.error("Chat AI Error:", err);
    }

    return res.json({ reply });

  } catch (error) {
    console.error("Chat AI Failed:", error);
    return res.status(500).json({
      message: "Chat AI failed",
    });
  }
};

module.exports = {
  getAIInsights,
  chatWithAI,
};