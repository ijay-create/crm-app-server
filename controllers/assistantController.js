const Customer = require("../models/Customer");
const calculateInsight = require("../utils/crmAssistant");

const getInsights = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: {
        companyId: req.user.companyId,
      },
    });

    const data = calculateInsight(customers);

    res.json(data);

  } catch (error) {
    res.status(500).json({
      message: "Assistant error",
    });
  }
};

module.exports = { getInsights };