const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Company = sequelize.define("Company", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  plan: {
    type: DataTypes.ENUM("free", "pro", "enterprise"),
    defaultValue: "free",
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Company;