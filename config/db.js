const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Neon PostgreSQL");
  } catch (error) {
    console.error("❌ Database connection failed");
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB,
};