const express = require("express");
const { getLogs,} = require("../controllers/activityController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getLogs);

module.exports = router;