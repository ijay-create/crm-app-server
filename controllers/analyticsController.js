const Customer = require("../models/Customer");

const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.count();

    const leads = await Customer.count({
      where: { status: "lead" },
    });

    const active = await Customer.count({
      where: { status: "active" },
    });

    const inactive = await Customer.count({
      where: { status: "inactive" },
    });

    res.json({
      totalCustomers,
      leads,
      active,
      inactive,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error loading analytics",
    });
  }
};

module.exports = { getDashboardStats };