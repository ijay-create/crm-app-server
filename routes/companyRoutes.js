const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const rbac = require("../middleware/rbac");

const Company = require("../models/Company");

/* =========================
   GET ALL COMPANIES
========================= */
router.get("/", protect, rbac("READ"), async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({ data: companies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
});

/* =========================
   CREATE COMPANY
========================= */
router.post("/", protect, rbac("CREATE"), async (req, res) => {
  try {
    const { name, plan } = req.body;

    const company = await Company.create({
      name,
      plan: plan || "free",
      isActive: true,
    });

    res.status(201).json({
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create company" });
  }
});

module.exports = router;