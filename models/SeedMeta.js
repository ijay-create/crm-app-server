const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SeedMeta = sequelize.define("SeedMeta", {
  key: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = SeedMeta;