const Customer = require("../models/Customer");
const logActivity = require("../utils/logActivity");
const notify = require("../utils/notify");
const calculateLeadScore = require("../utils/leadScore");
const runAutomation = require("../utils/runAutomation");

// =======================
// CREATE CUSTOMER
// =======================
const createCustomer = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        message: "Company context missing",
      });
    }

    const { fullName, email, phone, status } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        message: "fullName and email are required",
      });
    }

    const customer = await Customer.create({
      fullName,
      email,
      phone: phone || null,
      status: status || "new",
      companyId,
    });

    // Score calculation (safe)
    try {
      customer.score = calculateLeadScore(customer) || 0;
      await customer.save();
    } catch (err) {
      console.error("Score Error:", err);
    }

    // Automation (safe)
    try {
      await runAutomation(customer, req.app.get("io"));
    } catch (err) {
      console.error("Automation Error:", err);
    }

    await logActivity({
      action: "CREATE",
      entity: "Customer",
      entityId: customer.id,
      user: req.user?.fullName || "System",
    });

    const io = req.app.get("io");
    if (io) {
      notify(io, `New customer added: ${customer.fullName}`);
    }

    res.status(201).json(customer);

  } catch (error) {
    console.error("Create Customer Error:", error);
    res.status(500).json({
      message: "Error creating customer",
      error: error.message,
    });
  }
};

// =======================
// GET CUSTOMERS (PAGINATED)
// =======================
const getCustomers = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        message: "Company context missing",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Customer.findAndCountAll({
      where: { companyId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Fetch Customers Error:", error);
    res.status(500).json({
      message: "Error fetching customers",
    });
  }
};

// =======================
// UPDATE CUSTOMER
// =======================
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const customer = await Customer.findOne({
      where: { id, companyId },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    await customer.update(req.body);

    // Score update (safe)
    try {
      customer.score = calculateLeadScore(customer) || 0;
      await customer.save();
    } catch (err) {
      console.error("Score Update Error:", err);
    }

    // Automation (safe)
    try {
      await runAutomation(customer, req.app.get("io"));
    } catch (err) {
      console.error("Automation Error:", err);
    }

    await logActivity({
      action: "UPDATE",
      entity: "Customer",
      entityId: id,
      user: req.user?.fullName || "System",
    });

    const io = req.app.get("io");
    if (io) {
      notify(io, `Customer updated: ${customer.fullName}`);
    }

    res.json(customer);
  } catch (error) {
    console.error("Update Customer Error:", error);
    res.status(500).json({
      message: "Error updating customer",
    });
  }
};

// =======================
// DELETE CUSTOMER
// =======================
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user?.companyId;

    const customer = await Customer.findOne({
      where: { id, companyId },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    await customer.destroy();

    await logActivity({
      action: "DELETE",
      entity: "Customer",
      entityId: id,
      user: req.user?.fullName || "System",
    });

    const io = req.app.get("io");
    if (io) {
      notify(io, `Customer deleted: ${customer.fullName}`);
    }

    res.json({
      message: "Customer deleted",
    });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    res.status(500).json({
      message: "Error deleting customer",
    });
  }
};

// =======================
// UPDATE LEAD STATUS
// =======================
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const companyId = req.user?.companyId;

    const customer = await Customer.findOne({
      where: { id, companyId },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    customer.status = status;
    await customer.save();

    await logActivity({
      action: "UPDATE_STATUS",
      entity: "Customer",
      entityId: id,
      user: req.user?.fullName || "System",
    });

    const io = req.app.get("io");
    if (io) {
      notify(io, `${customer.fullName} moved to ${status}`);
    }

    res.json(customer);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      message: "Error updating status",
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  updateLeadStatus,
};