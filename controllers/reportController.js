const PDFDocument = require("pdfkit");
const Customer = require("../models/Customer");

const generateCustomerReport = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: {
        companyId: req.user.companyId,
      },
    });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("CRM Customer Report");

    doc.moveDown();

    customers.forEach((c) => {
      doc
        .fontSize(12)
        .text(`${c.fullName} - ${c.email} - ${c.status}`);
    });

    doc.end();

  } catch (error) {
    res.status(500).json({
      message: "Report generation failed",
    });
  }
};

module.exports = { generateCustomerReport };