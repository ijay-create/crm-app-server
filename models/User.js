const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(
        "super_admin",
        "admin",
        "staff",
        "observer_admin"
      ),
      allowNull: false,
      defaultValue: "staff",
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // NEW: Enable/Disable users
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    // NEW: Track last login
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // NEW: Password reset support
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Users",
    freezeTableName: true,
  }
);

module.exports = User;
