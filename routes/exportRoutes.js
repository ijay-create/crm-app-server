const express = require("express");

const {
  exportCustomersCSV,
} = require("../controllers/exportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/customers", protect, exportCustomersCSV);

module.exports = router;