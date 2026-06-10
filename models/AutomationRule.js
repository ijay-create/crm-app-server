const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AutomationRule = sequelize.define("AutomationRule", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  trigger: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  condition: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = AutomationRule;