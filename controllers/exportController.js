const Customer = require("../models/Customer");

const exportCustomersCSV = async (req, res) => {
  try {
    const customers = await Customer.findAll();

    let csv = "Name,Email,Company,Status,Score\n";

    customers.forEach((c) => {
      csv += `${c.fullName},${c.email},${c.company},${c.status},${c.score}\n`;
    });

    res.header("Content-Type", "text/csv");

    res.attachment("customers.csv");

    return res.send(csv);

  } catch (error) {
    res.status(500).json({
      message: "Export failed",
    });
  }
};

module.exports = { exportCustomersCSV };