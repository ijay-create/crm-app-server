const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    user: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    severity: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "low",
      validate: {
        isIn: [["low", "medium", "high"]],
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = ActivityLog;