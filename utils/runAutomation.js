const AutomationRule = require("../models/AutomationRule");

const runAutomation = async (customer, io) => {
  try {
    const rules = await AutomationRule.findAll();

    // safe fallback
    const socket = io || null;

    for (const rule of rules) {
      if (!rule || !socket) continue;

      // CUSTOMER CREATED RULE
      if (rule.trigger === "CUSTOMER_CREATED") {
        if (
          rule.condition === "status" &&
          customer.status === rule.value
        ) {
          socket.emit("notification", {
            message: `Automation triggered: ${rule.name}`,
          });
        }
      }

      // HIGH SCORE RULE
      if (rule.trigger === "HIGH_SCORE") {
        const threshold = Number(rule.value || 0);

        if ((customer.score || 0) >= threshold) {
          socket.emit("notification", {
            message: `High-value lead detected: ${customer.fullName}`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Automation Error:", error);
  }
};

module.exports = runAutomation;