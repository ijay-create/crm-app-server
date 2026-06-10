const Invoice = require("../models/Invoice");

const getRevenueStats = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();

    const totalRevenue = invoices
      .filter(i => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);

    const pendingRevenue = invoices
      .filter(i => i.status === "pending")
      .reduce((sum, i) => sum + i.amount, 0);

    const overdueRevenue = invoices
      .filter(i => i.status === "overdue")
      .reduce((sum, i) => sum + i.amount, 0);

    res.json({
      totalRevenue,
      pendingRevenue,
      overdueRevenue,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error loading revenue",
    });
  }
};

module.exports = { getRevenueStats };