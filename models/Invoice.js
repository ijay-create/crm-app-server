const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Invoice = sequelize.define("Invoice", {
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("paid", "pending", "overdue"),
    defaultValue: "pending",
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Invoice;