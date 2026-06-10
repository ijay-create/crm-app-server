require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

// =========================
// DB + MODELS
// =========================
const { connectDB } = require("./config/db");
const db = require("./models"); // 🔥 IMPORTANT FIX (registers all models)

// =========================
// ROUTES
// =========================
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const activityRoutes = require("./routes/activityRoutes");
const emailRoutes = require("./routes/emailRoutes");
const automationRoutes = require("./routes/automationRoutes");
const financeRoutes = require("./routes/financeRoutes");
const exportRoutes = require("./routes/exportRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const reportRoutes = require("./routes/reportRoutes");
const billingRoutes = require("./routes/billingRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const companyRoutes = require("./routes/companyRoutes");

// OPTIONAL ROUTES (safe load)
let userRoutes;
try {
  userRoutes = require("./routes/userRoutes");
} catch (err) {
  console.warn("⚠️ userRoutes not found, skipping...");
}

// =========================
// SEEDING
// =========================
const seedSuperAdmin = require("./seeders/superAdmin.seed");
const SeedMeta = require("./models/SeedMeta");

// =========================
// APP INIT
// =========================
const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/automation", automationRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/companies", companyRoutes);

// OPTIONAL ROUTES (safe load)
if (userRoutes) {
  app.use("/api/users", userRoutes);
}

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("CRM API running");
});

/* =========================
   SOCKET.IO
========================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("io", io);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔄 Connecting database...");
    await connectDB();

    console.log("🔄 Loading models...");
    await db.sequelize.authenticate();

    // =========================
    // STEP 1: CREATE CORE TABLES FIRST (NO ALTER)
    // =========================
    await db.sequelize.sync({ alter: false });

    console.log("🔄 Ensuring base company exists...");

    const { Company } = db;

    // FORCE CREATE COMPANY BEFORE USERS
    const [company] = await Company.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: "Default Company",
        plan: "free",
        isActive: true,
      },
    });

    console.log("✅ Base company ready:", company.id);

    // =========================
    // STEP 2: NOW SAFE ALTER SYNC
    // =========================
    console.log("🔄 Running safe schema sync...");
    await db.sequelize.sync({ alter: true });

    // =========================
    // SEEDING
    // =========================
    await SeedMeta.sync();
    await seedSuperAdmin();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    console.log("✅ Server startup complete");
  } catch (error) {
    console.error("❌ Server startup failed:");
    console.error(error);
    process.exit(1);
  }
};

startServer();