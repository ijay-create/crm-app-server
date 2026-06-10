const sequelize = require("../config/db").sequelize;

// =========================
// IMPORT MODELS
// =========================
const User = require("./User");
const Company = require("./Company");
const Customer = require("./Customer");
const Invoice = require("./Invoice");
const Message = require("./Message");
const ActivityLog = require("./ActivityLog");

// =========================
// RELATIONSHIPS
// =========================

// Company Relations
Company.hasMany(User, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Company.hasMany(Customer, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Company.hasMany(Invoice, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Company.hasMany(Message, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// User Relations
User.belongsTo(Company, {
  foreignKey: "companyId",
});

// Customer Relations
Customer.belongsTo(Company, {
  foreignKey: "companyId",
});

Customer.hasMany(Invoice, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Invoice Relations
Invoice.belongsTo(Customer, {
  foreignKey: "customerId",
});

Invoice.belongsTo(Company, {
  foreignKey: "companyId",
});

// Message Relations
Message.belongsTo(Company, {
  foreignKey: "companyId",
});

// =========================
// EXPORTS
// =========================
module.exports = {
  sequelize,
  User,
  Company,
  Customer,
  Invoice,
  Message,
  ActivityLog,
};