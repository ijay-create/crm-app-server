const AutomationRule = require("../models/AutomationRule");

// =======================
// CREATE RULE
// =======================
const createRule = async (req, res) => {
  try {
    const rule = await AutomationRule.create(req.body);

    return res.status(201).json(rule);
  } catch (error) {
    console.error("Create Rule Error:", error);

    return res.status(500).json({
      message: "Error creating rule",
    });
  }
};

// =======================
// GET RULES
// =======================
const getRules = async (req, res) => {
  try {
    const rules = await AutomationRule.findAll();

    return res.json(rules);
  } catch (error) {
    console.error("Get Rules Error:", error);

    return res.status(500).json({
      message: "Error fetching rules",
    });
  }
};

// =======================
// WEBHOOK
// =======================
const triggerWebhook = async (req, res) => {
  try {
    const payload = req.body;

    console.log("Webhook received:", payload);

    // future automation processing can go here safely
    // e.g. rule engine, event matching, etc.

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error("Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook failed",
    });
  }
};

// =======================
// EXPORTS
// =======================
module.exports = {
  createRule,
  getRules,
  triggerWebhook,
};