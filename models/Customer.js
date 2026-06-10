const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Customer = sequelize.define("Customer", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM(
      "active",
      "inactive",
      "lead"
    ),
    defaultValue: "lead",
  },

  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  // ✅ ADD HERE
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Customer;