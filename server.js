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
const db = require("./models");

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
const server = http.createServer(app);

// =========================
// ENV
// =========================
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// =========================
// CORS CONFIG (PRODUCTION SAFE)
// =========================
const allowedOrigins = [CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(cookieParser());

// =========================
// ROUTES
// =========================
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

if (userRoutes) {
  app.use("/api/users", userRoutes);
}

// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.send("CRM API running");
});

// =========================
// SOCKET.IO
// =========================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
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

// =========================
// START SERVER
// =========================
const startServer = async () => {
  try {
    console.log("🔄 Connecting database...");
    await connectDB();

    console.log("🔄 Loading models...");
    await db.sequelize.authenticate();

    console.log("🔄 Syncing database...");
    await db.sequelize.sync(); // SAFE FOR PRODUCTION

    console.log("🔄 Ensuring base company exists...");

    const { Company } = db;

    await Company.findOrCreate({
      where: { id: 1 },
      defaults: {
        id: 1,
        name: "Default Company",
        plan: "free",
        isActive: true,
      },
    });

    console.log("🔄 Running seeding...");

    try {
      await SeedMeta.sync();
      await seedSuperAdmin();
    } catch (err) {
      console.log("⚠️ Seeding skipped:", err.message);
    }

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