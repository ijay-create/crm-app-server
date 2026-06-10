const ActivityLog = require("../models/ActivityLog");

const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      order: [["createdAt", "DESC"]],
      limit: 30,
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching logs",
    });
  }
};

module.exports = { getLogs };