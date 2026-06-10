const express = require("express");

const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  updateLeadStatus,
} = require("../controllers/customerController");

const protect = require("../middleware/authMiddleware");
const rbac = require("../middleware/rbac");
const cache = require("../middleware/cache");

const router = express.Router();

/* =======================
   READ (cached)
======================= */
router.get(
  "/",
  protect,
  rbac("READ"),
  cache("customers"),
  getCustomers
);

/* =======================
   CREATE
======================= */
router.post(
  "/",
  protect,
  rbac("CREATE"),
  createCustomer
);

/* =======================
   UPDATE CUSTOMER
   (PUT + PATCH support for frontend safety)
======================= */
router.put(
  "/:id",
  protect,
  rbac("UPDATE"),
  updateCustomer
);

// 🔥 compatibility fix (frontend may use PATCH)
router.patch(
  "/:id",
  protect,
  rbac("UPDATE"),
  updateCustomer
);

/* =======================
   DELETE
======================= */
router.delete(
  "/:id",
  protect,
  rbac("DELETE"),
  deleteCustomer
);

/* =======================
   LEAD STATUS UPDATE
======================= */
router.patch(
  "/:id/status",
  protect,
  rbac("UPDATE"),
  updateLeadStatus
);

module.exports = router;